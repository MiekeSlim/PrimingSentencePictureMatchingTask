PennController.ResetPrefix(null);
PennController.DebugOff()
PennController.SetCounter("Counter")

PennController.Sequence("CheckPreload", "BrowserCheck", "L1Check", "Counter", "Welcome", "Consent", "Trials", "Questionnaire", "Send", "FinalPage")

AddHost("https://users.ugent.be/~mslim/SK_images/");

// Check preload of required files:
CheckPreloaded("CheckPreload")

// Check for Browser and L1
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
        .add("center at 20%", "top at 60%", getText("YesBrowser"))
        .add("center at 80%", "top at 60%", getText("NoBrowser"))
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
        .add("center at 20%", "top at 60%", getText("YesL1"))
        .add("center at 80%", "top at 60%", getText("NoL1"))
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


// Check for Browser and L1
newTrial("Welcome",
    newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
    ,
    newVar("Subject")
        .global()
        .set( getTextInput("Subject") )
        ,
        newText("WelcomeText", "Hello and thank you for participating in this study! <br><br> This experiment is an partly in English and partly in Estonian. It is important that you are a native speaker of <strong> Estonian </strong>, because this survey focuses on Estonian-English bilingual language comprehension.<br><br> In each question of the survey, you will be asked to match a picture with an English sentence. <b> Please read each sentence carefully, before you select the the picture. </b> If you believe that multiple pictures can be matched to the sentence, please choose your spontaneous preference. After this task, you will be asked to give some information on your language background. <br><br> If you would like more details about the findings of this experiment, please send me an email on mieke.slim@ugent.be, and I will send you a report of the findings. Note that taking part in this experiment is entirely voluntary and refusal or withdrawal will involve no penalty or loss, now or in the future. <br><br> I (Mieke Slim) can be contacted via mieke.slim@ugent.be if there is anything that is not clear or if you would like more information. <br><br> Your answers are stored anonymously, and personal details can only be accessed by me (Mieke Slim). The results of this survey will disseminated in academic journals and at conferences. Results are  presented in terms of groups of individuals. If any individual data are presented, the data will be completely anonymous, without any means of identifying the individuals involved. <br><br> The project has received ethical approval from the Research Ethics Committee of the Faculty of Modern and Medieval Languages at the University of Cambridge (UK).<br><br> I you have any questions, please email me on mieke.slim@ugent.be <br><br> <b> Sometimes, a screen that says that the survey is loading may appear. If this happens, please wait for a couple of seconds. This never takes long. </b> <br><br> Press SPACE to continue to the next page ")
        ,
    newCanvas( "myCanvas", "60vw" , "60vh")
        .add(0,0, getText("WelcomeText"))
        .print("center at 50%", "top at 25%")
    ,
    newKey("next", "")
        .wait()  
     )
     .log( "Subject" , getVar("Subject") ) 

// Consent
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

// Implementing the Trials
PennController.Template("trials.csv",
    variable => PennController("Trials", 
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
            .settings.size("30vh","30vh")
            .settings.css( "border" , "solid 1px black" )                                   
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

// Questionnare
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

// Send the results to the server
PennController.SendResults("Send");

// Show the final page
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
