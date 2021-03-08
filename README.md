Code to implement Experiment 3 in Slim & Katsos (*under review*) in PCIbex
===

## Overview of the experiment 
This is code to implement a bilingual sentence-picture matching task. In this task, the participants read a sentence and have to match that sentence with one out of two pictures. In this sentence-picture matching task, I tested priming of logical representations in the interpretations of English and Estonian *all...not* sentences. This task contains three types of trials: *fillers*, *primes*, and *targets*. The fillers are quite straightforward: The sentence is unambiguous, one picture matches the sentence, and one picture is a foil picture that does not fit the sentence. The prime trials contain an *all...not* sentence (e.g., \textit{All the apples are not in the boxes}). These sentences are ambiguous: *all* can take wide scope over *not* (resulting in the interpretation that \textit{none} of the apples are in the boxes), but *not* can also take wide scope over *all* (resulting in the interpretation that *not all*, but some, apples are in the boxes). In the prime trials, one picture is a foil picture that matches neither interpretation of the sentence; the matching picture matches the sentence, but only one of the two possible interpretations. This way, the participants are forced to assign one interpretation to the prime sentence. Target trials, finally, also involve an *all...not* sentence, but now both pictures display both possible interpretations of the sentence. The rationale of this experiment is that by priming one of the two interpretations in the prime trials, we promote the likelihood that that same interpretation will be assigned to the target trials (i.e., there is priming). Full detail about the rationale and goals of this experiment, but you can read more about those in the pre-print of this study (https://psyarxiv.com/tv2w8/).

There are a couple of characteristics of this experiment that are important for coding (in no particular order): 
- The trials are given in a pseudo-randomized order: two primes are presented directly before each trial, and each prime-target triplet is interspersed by two to five filler trials. 
- Participants select one out of two pictures by selecting their chosen image by means of a mouse click, once they've selected a picture, the next trial starts.
- The task is bilingual: The primes are given in English (the participants' L2) and the targets in Estonian (the participants' L1). Moreover, half of the fillers are in English and the other half in Estonian.
- Estonian spelling requires quite some special characters (such as the õ, these characters need to be given in html code. 
- The experiment requires a lot of pictures, which takes up too much space on the PCIbex Farm. Therefore, the pictures are hosted at a distant server.

## Breakdown and description of the code
Here, I will describe the functionality of each chunk of code in the `main.js` file:

### Preamble
```
PennController.ResetPrefix(null);
PennController.DebugOff();
AddHost("https://users.ugent.be/~mslim/SK_images/");

PennController.SetCounter("Counter");

PennController.Sequence("Checks", "Counter", "Welcome", "Consent", "trials", "Ctest", "QuestionnairePage", "DebriefingPage", "Send", "Closing")
```

In this preamble, we specify the order of the elements in the experiment (using the `Sequence` command). Importantly, the participants will first see some questions to check whether they are actually eligible to do this experiment (they need to be native speakers of Estonian and do this experiment on a web browser, so not on a mobile phone). If they meet these requirements (i.e., they said 'yes' on both questions), the `SetCounter` command is launched. This command sets the internat counter of PCIbex, which keeps track of how many participants started the experiment. We will see later that this is relevant for counterbalancing.

Another important part in this preamble is the `AddHost()` command. All images are saved on an external webserver (hosted by the UGent), and this command tells PCIbex where to find that server. 

### 'Checks' section
```
PennController("Checks",
    newText("Two short questions:")
        .print()
    ,
    newText("L1", "<br><br>Is Estonian your native language?<br><br>")
        .print()
    ,
    newButton("yesEstonian", "Yes")
    ,
    newButton("noEstonian", "No")
        .settings.before( getButton("yesEstonian") )
        .print()
    ,
    newSelector("yesnoEstonian")
        .settings.add( getButton("yesEstonian") , getButton("noEstonian"))
        .wait()
    ,
    getSelector("yesnoEstonian")
        .settings.log()
        .test.selected(getButton("yesEstonian") )
        .failure(
            newText("<br><br>For this survey, we are looking for native speakers of Estonian. Unfortunately, you won't be able to participate.<br><br>")
                .print()
            ,
            newKey("SPACE")
            .wait()
        )
    ,
    newText("Device", "<br><br>Are you doing this experiment on a web browser on a computer or laptop (not on a phone, iPad, etc.)?<br><br>")
        .print()
    ,
    newButton("yesPC", "Yes")
    ,
    newButton("noPC", "No")
        .settings.before( getButton("yesPC") )
        .print()
    ,
    newSelector("yesnoPC")
        .settings.add( getButton("yesPC") , getButton("noPC"))
        .wait()
    ,
    getSelector("yesnoPC")
        .settings.log()
        .test.selected(getButton("yesPC") )
        .failure(
            newText("<br><br>Unfortunately, this experiment only works on a computer. Please close the experiment and come back on a computer or laptop. <br><br>")
                .print()
            ,
            newKey("SPACE")
            .wait()
        )         
)
```
This piece of code is used to show the two pre-experimental questions to the participants. First, the participants are asked whether they are native speakers of Estonian. Then, they are asked whether they are doing the experiment on a desktop/laptop. They will give these answers by clicking on the 'yes' and 'no' buttons. In case they select 'no' (which was tested using the `test.selected(getButton())` command), the participants are redirected to a screen that tells them that they are not eligible to participate in this experiment. If they answer 'yes', the code will execute the full script. 

### 'Welcome' section
```
PennController("Welcome",
    newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
    ,
    newVar("Subject")
        .settings.global()
        .set( getTextInput("Subject") )
    ,
    newText("WelcomeText", "<p>Hello and thank you for participating in this study! </p><p> </p><p> This experiment is an experiment in English, but for this           experiment it is important that you are a native speaker of <strong> Estonian </strong>. This because this survey focuses on Estonian-English bilingual             language comprehension. You will be asked to match a picture with an English sentence. <b> Please read each sentence carefully, before you select the the           picture. </b> If you believe that multiple pictures can be matched to the sentence, please choose your spontaneous preference. After this task, you will be         asked to give some information on your language background. </p><p> </p><p>  If you would like more details about the findings of this experiment, please send     me an email on mieke.slim@ugent.be, and I will send you a report of the findings. Note that taking part in this experiment is entirely voluntary and refusal       or withdrawal will involve no penalty or loss, now or in the future. </p><p> </p><p> </p><p> </p><p> I (Mieke Slim) can be contacted via mieke.slim@ugent.be       if there is anything that is not clear or if you would like more information. </p><p> </p><p> Your answers are stored anonymously, and personal details can         only be accessed by me (Mieke Slim). The results of this survey will disseminated in academic journals and at conferences. Results are  presented in terms of       groups of individuals. If any individual data are presented, the data will be completely anonymous, without any means of identifying the individuals involved.     </p><p> </p><p> The project has received ethical approval from the Research Ethics Committee of the Faculty of Modern and Medieval Languages at the University     of Cambridge (UK).</p><p> </p><p> I you have any questions, please email me on mieke.slim@ugent.be</p><p> <br> <b> Sometimes, a screen that says that the           survey is loading may appear. If this happens, please wait for a couple of seconds. This never takes long. </b> ")
    ,
    newCanvas( "myCanvas", 500, 800)
            .settings.add(0,0, getText("WelcomeText"))
            .print()
   ,
   newButton("finish", "Continue")
        .print()
        .wait()  
   )
   .log( "Subject" , getVar("Subject") )    
```
This welcome page is pretty straightforward: The participants are informed about the study. Note that I use html commands such as `<b>` and `<\b>` to make up the text. The text is shown in a `canvas()` element, so it's nicely centred in the screen. The participants continue to the next page by clicking on a 'continue' button. 

In this 'welcome' section, we also generate a random Subject ID for each participant. This is done by using javascript's `Math.random()` command. This creates a random number between 0 and 1. We multiply this random number by 1000000, and round it to the nearest integer using the `Math.floor()` command. We save this number as a variable by using PCIbex' `newVar()` command. Note how this bit of code shows that 'bare' javascript can be used within the PCIbex environment quite easily. 
