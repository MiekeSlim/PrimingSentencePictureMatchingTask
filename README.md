Code to implement Experiment 3 in Slim & Katsos (*under review*) in PCIbex
===

## Overview of the experiment 
This is code to implement a bilingual sentence-picture matching task. In this task, the participants read a sentence and have to match that sentence with one out of two pictures. In this sentence-picture matching task, we tested priming of logical representations in the interpretations of English and Estonian *all...not* sentences. This task contains three types of trials: *fillers*, *primes*, and *targets*. The fillers are quite straightforward: The sentence is unambiguous, one picture matches the sentence, and one picture is a foil picture that does not fit the sentence. The prime trials contain an *all...not* sentence (e.g., *All the apples are not in the boxes*). These sentences are ambiguous: *all* can take wide scope over *not* (resulting in the interpretation that *none* of the apples are in the boxes), but *not* can also take wide scope over *all* (resulting in the interpretation that *not all*, but some, apples are in the boxes). In the prime trials, one picture is a foil picture that matches neither interpretation of the sentence; the matching picture matches the sentence, but only one of the two possible interpretations. This way, the participants are forced to assign one interpretation to the prime sentence. Target trials, finally, also involve an *all...not* sentence, but now both pictures display both possible interpretations of the sentence. The rationale of this experiment is that by priming one of the two interpretations in the prime trials, we promote the likelihood that that same interpretation will be assigned to the target trials (i.e., there is priming). I won't describe the rationale and goals of this experiment in full detail here, but you can read more about those in the pre-print of this study (https://psyarxiv.com/tv2w8/).

There are a couple of characteristics of this experiment that are important for coding (in no particular order): 
- The trials are given in a pseudo-randomized order: two primes are presented directly before each trial, and each prime-target triplet is interspersed by two to five filler trials. Although it should be possible to code such complex randomizations in (PC)Ibex, it is not necessarily easy. Therefore, I used 'pre-randomized' lists. The participants are then distributed over these lists (using PCIbex' internal counter an a group variable). 
- Participants select one out of two pictures by selecting their chosen image by means of a mouse click, once they've selected a picture, the next trial starts.
- The task is bilingual: The primes are given in English (the participants' L2) and the targets in Estonian (the participants' L1). Moreover, half of the fillers are in English and the other half in Estonian.
- Estonian spelling requires quite some special characters (such as the õ, these characters need to be given in html. 
- The experiment requires a lot of pictures, which takes up too much space on the PCIbex Farm. Therefore, the pictures are hosted at a distant server.
- The left-right position of the pictures is counterbalanced (so not completely randomized). It would actually be easier to randomize the position of the pictures, but I decided to counterbalance because I did this in the previous experiments that were conducted in this study (which were not programmed in PCIbex, but administered over Qualtrics).

## Contents of this GitHub repository
All the files needed to implement this experiment are stored in a GitHub repository (https://github.com/MiekeSlim/PrimingSentencePictureMatchingTask.git). This repository contains two folders: *chunk_includes* and *data_includes*. All resources needed for your experiment (such as image files, trial templates, or html files) are stored within the *chunk_includes* folder. The *data_includes* folder contains the `main.js` file, which is the main script in which you will be working most of the time (which I will describe in more detail below).

The *chunk_includes* folder in this repository contains the following files: `consent.html`, `trials.csv`, and `QuestionnaireIBEX_bilinguals.html`. The html files are forms that need to be filled in by the participants (which I find easier to implement in html, but can also be done by using only the PCIbex environment). The `trials.csv` file is table that specifies the required information of each trial. PCIbex 'reads' this table row-by-row, and uses the information given in each row in each trial.  This template contains the following columns:

| Variable | Description |
|----------|-------------|
|Group     | Whether the trial is in list A or list B (which are two counterbalanced lists). Using PCIbex' internal counter, the first participant will be assigned to Group A, the second to Group B, the third to Group A again, and so on. The trials with value A in this column will be shown to the participants in group A, and the trials with value B in this column will be shown to the participants in group B. |
|Stimuli_Type | Whether this is a filler, prime, or target trial |
|Item| Each trial has a unique code, specified here |
|PrimeCondition| Whether the trial is presented in the universal-wide or negation-wide condition (only relevant for primes and targets |
|Sentence| The sentence shown in the trial |
|Picture 1| Filename of the leftmost picture |
|Picture 2| Filename of the rightmost picture |
|CorPic| Whether the matching picture (for fillers and primes) or the universal-wide picture (for targets) was shown on the left or on the right|

The files in this GitHub repository (or in any GitHub repository) can easily be loaded into the PCIbex Farm using the *Git Sync* function: Start an empty project on the PCIbex farm, select *Git Sync*, paste the URL of the repository, select the branch of the repository (typically *main* or *master*) and allow PCIbex to overwrite the desired files with those given in the repository. 

## Breakdown and description of the code
Here, I will describe the functionality of each chunk of code in the `main.js` file. I will not go into much detail about the functioning of each specific command, since this information is all available on the PCIbex website (https://doc.pcibex.net/).

### Preamble
```
PennController.ResetPrefix(null);
PennController.DebugOff()
PennController.SetCounter("Counter")
//PennController.Sequence("CheckPreload", "BrowserCheck", "L1Check", "Counter", "Welcome", "Consent", "trials", "Ctest", "QuestionnairePage", "DebriefingPage", "Send", "Closing")

AddHost("https://users.ugent.be/~mslim/SK_images/");

// Check preload of required files:
CheckPreloaded("CheckPreload")
```

In this preamble, we specify the order of the elements in the experiment (using the `Sequence` command). Importantly, the participants will first see some questions to check whether they are actually eligible to do this experiment (they need to be native speakers of Estonian and do this experiment on a web browser, so not on a mobile phone). If they meet these requirements (i.e., they said 'yes' on both questions), the `SetCounter` command is launched. This command sets the internat counter of PCIbex, which keeps track of how many participants started the experiment. This is relevant for counterbalancing and dividing the participants over the different lists.

Another important part in this preamble is the `AddHost()` command. All images are saved on an external webserver (hosted by the UGent), and this command tells PCIbex where to find that server. 

### 'Checks' section
```
newTrial("BrowserCheck",
    newText("BrowserCheckText", "Two brief questions before we begin:<br><br>This survey only works well if it's opened on a browser on a desktop computer or laptop (so not on a mobile phone or tablet). Are you currently using a laptop or a desktop computer?")
    ,
    newText("NoBrowser", "No, I am using another device")
        .css("background-color", "lightgrey")
    ,
    newText("YesBrowser", "Yes")
        .css("background-color", "lightgrey")
    ,
    newCanvas("ChecksCanvas", "60vw" , "20vh")
        .add("center at 50%", "top at 10%", getText("BrowserCheckText"))
        .add("center at 20%", "top at 50%", getText("YesBrowser"))
        .add("center at 80%", "top at 50%", getText("NoBrowser"))
        .print("center at 50%", "top at 25%") 
    ,
    newSelector("yesno")
        .settings.add( getText("YesBrowser") , getText("NoBrowser"))
        .wait()
    ,
    getSelector("yesno")
        .settings.log()
        .test.selected(getText("YesBrowser"))
        .failure(
            getCanvas("ChecksCanvas")
                .remove()
            ,
            newCanvas("NoChrome", "60vw" , "20vh")
                .add("center at 50%", "top at 10%", newText("Please close the experiment by closing the browser (you may ignore possible pop-up screens), and come back on a desktop computer or laptop."))
                .print("center at 50%", "top at 25%") 
            ,
            newButton("waitforever")
                .wait()
        )
)

newTrial("L1Check",
    newText("L1CheckText", "Two brief questions before we begin:<br><br>To participate in this study, it is required that you are a <b>native speaker of Estonian</b>. Are you a native speaker of Estonian?")
    ,
    newText("NoL1", "No, I am not a native speaker of Estonian")
        .css("background-color", "lightgrey")
    ,
    newText("YesL1", "Yes, Estonian is my first language")
        .css("background-color", "lightgrey")
    ,
    newCanvas("ChecksCanvas", "60vw" , "20vh")
        .add("center at 50%", "top at 10%", getText("L1CheckText"))
        .add("center at 20%", "top at 50%", getText("YesL1"))
        .add("center at 80%", "top at 50%", getText("NoL1"))
        .print("center at 50%", "top at 25%") 
    ,
    newSelector("yesno")
        .settings.add( getText("YesL1") , getText("NoL1"))
        .wait()
    ,
    getSelector("yesno")
        .settings.log()
        .test.selected(getText("YesL1"))
        .failure(
            getCanvas("ChecksCanvas")
                .remove()
            ,
            newCanvas("NoL1", "60vw" , "20vh")
                .add("center at 50%", "top at 10%", newText("Unfortunately, you are not eligible to participate in this study. Please close the experiment by closing the browser (you may ignore possible pop-up screens)."))
                .print("center at 50%", "top at 25%") 
            ,
            newButton("waitforever")
                .wait()
        )
)

```
This piece of code is used to show the two pre-experimental questions to the participants. First, the participants are asked whether they are native speakers of Estonian. Then, they are asked whether they are doing the experiment on a desktop/laptop. They will give these answers by clicking on the 'yes' and 'no' buttons. In case they select 'no' (which was tested using the `test.selected(getText())` command), the participants are redirected to a screen that tells them that they are not eligible to participate in this experiment. If they answer 'yes', the code will execute the full script. 

### 'Welcome' section
```
newTrial("Welcome",
    newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
    ,
    newVar("Subject")
        .global()
        .set( getTextInput("Subject") )
        ,
        newText("WelcomeText", "Hello and thank you for participating in this study! <br><br> This experiment is an partly in English and partly in Estonian. It is important that you are a native speaker of <strong> Estonian </strong>, because this survey focuses on Estonian-English bilingual language comprehension.<br><br> In each question of the survey, you will be asked to match a picture with an English sentence. <b> Please read each sentence carefully, before you select the the picture. </b> If you believe that multiple pictures can be matched to the sentence, please choose your spontaneous preference. After this task, you will be asked to give some information on your language background. <br><br> If you would like more details about the findings of this experiment, please send me an email on mieke.slim@ugent.be, and I will send you a report of the findings. Note that taking part in this experiment is entirely voluntary and refusal or withdrawal will involve no penalty or loss, now or in the future. <br><br> I (Mieke Slim) can be contacted via mieke.slim@ugent.be if there is anything that is not clear or if you would like more information. <br><br> Your answers are stored anonymously, and personal details can only be accessed by me (Mieke Slim). The results of this survey will disseminated in academic journals and at conferences. Results are  presented in terms of groups of individuals. If any individual data are presented, the data will be completely anonymous, without any means of identifying the individuals involved. <br><br> The project has received ethical approval from the Research Ethics Committee of the Faculty of Modern and Medieval Languages at the University of Cambridge (UK).<br><br> I you have any questions, please email me on mieke.slim@ugent.be <br><br> <b> Sometimes, a screen that says that the survey is loading may appear. If this happens, please wait for a couple of seconds. This never takes long. </b> ")
        ,
    newCanvas( "myCanvas", "60vw" , "60vh")
        .add(0,0, getText("WelcomeText"))
        .print()
    ,
    newButton("next", "Continue")
        .center()
        .print()
        .wait()  
     )
     .log( "Subject" , getVar("Subject") ) 
      
```
This welcome page is pretty straightforward: The participants are informed about the study. Note that I use html commands such as `<b>` and `<\b>` to make up the text. The text is shown in a `canvas()` element, so it's nicely centred in the screen. The participants continue to the next page by clicking on a 'continue' button. 

In this 'welcome' section, we also generate a random Subject ID for each participant. This is done by using javascript's `Math.random()` command. This creates a random number between 0 and 1. We multiply this random number by 1000000, and round it to the nearest integer using the `Math.floor()` command. We save this number as a variable by using PCIbex' `newVar()` command. This variable is then set as `.global()` so it will be accesible in the whole script (if it is only saved locally, it is only accessible in within the `newTrial` environment of this specific trial (i.e., the welcome page). Note how this bit of code shows that 'bare' javascript can be used within the PCIbex environment quite easily.

### Consent section
```
newTrial("Consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
)
 ```
This bit of code displays the consent text, participants can give their consent by checking a box in the form. This form is created in html, as I find it easier to create forms this way. Those who have done the advanced tutorial on the PCIbex website may recognize this bit of code ;-).
 
 ### Trial structure
Now we get to the 'heart' of the experiments: the trials. The bit of code below can be read as a blueprint for each trial, in which some pieces of required information are still missing - namely those parts in the trial that vary from trial to trial (such as the sentence and the pictures). PCIbex will fill in these variables with the values specified in the *trials.csv* file described above (since the `.Template()` command).
 
```
 PennController.Template("trials.csv",
    variable => PennController("trials", 
        newText("sentence", variable.Sentence)
            .center()
            .css("font-size", "30px")
            .bold()
            .print()
        ,
        newImage("picture1", variable.Picture1)
            .size("30vh","30vh")
            .css( "border" , "solid 1px black" )
        ,
        newImage("picture2", variable.Picture2)
            .size("30vh","30vh")
            .css( "border" , "solid 1px black" )                                   
        ,
        newCanvas("80vw","50vh")
            .center()
            .add("center at 35%"   , "middle at 50%",   getImage("picture1"))
            .add("center at 65%"   , "middle at 50%",   getImage("picture2"))
            .print()
        ,
        newSelector()
            .add( getImage("picture1") , getImage("picture2") )
            .log()
            .wait()
        )
    .log( "Subject"         , getVar("Subject") ) 
    .log( "Group"           , variable.Group            )
    .log( "StimulusType"    , variable.Stimuli_Type     )                            
    .log( "Sentence"        , variable.Sentence         )
    .log( "Item"            , variable.Item             )
    .log( "Picture1"        , variable.Picture1         )                           
    .log( "Experiment"      , variable.CorPic           ) 
    .log( "Picture2"        , variable.Picture2         )
    .log( "PrimeCondition"  , variable.PrimeCondition   )                            
)
```
In this piece of code `variable` is the array variable that will be used to navigate through the *trials.csv* table. In the first trial (i.e., the first iteration of this code), `variable` specifies all the information given in the first row of the table, and so on. Note that it doesn't matter how this variable is named, als long as it's a unique name. 

Each trial essentially contains three main components: a sentence, a picture shown on the left, and a picture shown on the right. First, the sentence is generated using a `Text` element; note that we can acces specific columns in the trial table by using `variable.COLUMNNAME`, as is done here by using `variable.Sentence`. Second, the pictures are generated using the `Image` elements. These pictures are then shown in the middle of the screen with the help of a `Canvas` element. A `Selector` element is used to make the pictures 'clickable'. Once a picture is selected, the next trial starts automatically.

In each trial, we want to know which picture is selected. This is saved onto the datafile using the `.log()` command. Note that we also save the specifics of each trial (as defined in the *trials.csv* file), so we get a nice readable datafile straight away (otherwise, this information would need to be added to the datafile post-hoc; which becomes very difficult in case the trials are fully randomized). 

### Questionnaire page
Once all trials are shown, the participants will be asked to fill in a short questionnaire about their linguistic background. This is again implemented in a html form - I won't go in much detail, since there is a lot of information on the internet on how to generate html forms. 
```
newTrial("Questionnaire",
    newHtml("questionnaire_form", "QuestionnareIBEX_bilinguals.html")
        .cssContainer({"width":"720px"})
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait(getHtml("questionnaire_form").test.complete()
                  .failure(getHtml("questionnaire_form").warn())
        )
)
```

### Sending the results to the server
All the the results are then send to the server (namely: the servers of the PCIbex farm) using the following command:

```
SendResults("Send")
```

### Showing the final page
And finally, a closing page is shown to the participants, as generated by the following chunk of code:
```
newTrial("FinalPage",
    newText("FinalText", "You’ve completed the experiment. Thank you very much for your participation! <br><br>If you want to know more about the goals of this experiment or if you want to know the results once the experiment is done, feel free to get in touch with me (Mieke Slim) via mieke.slim@ugent.be. <br><br> You can close the experiment by closing the browser (please ignore any pop-up windows).")
    ,
    newCanvas("myCanvas", "60vw" , "60vh")
        .settings.add("center at 50%",0, getText("FinalText"))       
        .print("center at 50%", "top at 25%")   
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)
.setOption("countsForProgressBar",false)
```
The closing text is shown to the participants using a `Text` element within a `Canvas` element. A button is generated, but not printed on the screen. Therefore, people are essentially stuck on this page forever (unless, of course, they close the experiment - which is exactly what we want).


