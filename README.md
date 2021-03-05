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
PennController.SetCounter("Counter");

PennController.Sequence("Checks", "Counter", "Subject", "Welcome", "Consent", "trials", "Ctest", "QuestionnairePage", "DebriefingPage", "Send", "Closing")
```

In this preamble, we specify the order of the elements in the experiment (using the `Sequence` command). Importantly, the participants will first see some questions to check whether they are actually eligible to do this experiment (they need to be native speakers of Estonian and do this experiment on a web browser, so not on a mobile phone). If they meet these requirements (i.e., they said 'yes' on both questions), the `SetCounter` command is launched. This command sets the internat counter of PCIbex, which keeps track of how many participants started the experiment. We will see later that this is relevant for counterbalancing.

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
