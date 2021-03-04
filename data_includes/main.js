PennController.ResetPrefix(null);
PennController.DebugOff()
PennController.SetCounter("Counter")
PennController.Sequence("Checks", "Counter", "Subject", "Welcome", "Consent", "trials", "Ctest", "QuestionnairePage", "DebriefingPage", "Send", "Closing")

// Check for L1
PennController("Checks",
    newText("Two short questions::")
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

// Subject info
   PennController("Subject",
    defaultText
        .print()
    ,
    newText("<p>Please enter your ProlificID </p>")
    ,
    newTextInput("ProlificID")
        .print()
    ,
    newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
    ,
    newButton("Start")
        .print()
        .wait()
    ,
    newVar("Subject")
        .settings.global()
        .set( getTextInput("Subject") )
    ,
    newVar("ProlificID")
        .settings.global()
        .set( getTextInput("ProlificID") )
    )
    .log( "Subject" , getVar("Subject") )
    .log( "ProlificID" , getVar("ProlificID") )


// Welcome
// Instructions
    PennController("Welcome",
        newText("WelcomeText", "<p>Hello and thank you for participating in this study! </p><p> </p><p> This experiment is an experiment in English, but for this experiment it is important that you are a native speaker of <strong> Estonian </strong>. This because this survey focuses on Estonian-English bilingual language comprehension. You will be asked to match a picture with an English sentence. <b> Please read each sentence carefully, before you select the the picture. </b> If you believe that multiple pictures can be matched to the sentence, please choose your spontaneous preference. After this task, you will be asked to give some information on your language background. </p><p> </p><p>  If you would like more details about the findings of this experiment, please send me an email on mieke.slim@ugent.be, and I will send you a report of the findings. Note that taking part in this experiment is entirely voluntary and refusal or withdrawal will involve no penalty or loss, now or in the future. </p><p> </p><p> </p><p> </p><p> I (Mieke Slim) can be contacted via mieke.slim@ugent.be if there is anything that is not clear or if you would like more information. </p><p> </p><p> Your answers are stored anonymously, and personal details can only be accessed by me (Mieke Slim). The results of this survey will disseminated in academic journals and at conferences. Results are  presented in terms of groups of individuals. If any individual data are presented, the data will be completely anonymous, without any means of identifying the individuals involved. </p><p> </p><p> The project has received ethical approval from the Research Ethics Committee of the Faculty of Modern and Medieval Languages at the University of Cambridge (UK).</p><p> </p><p> I you have any questions, please email me on mieke.slim@ugent.be</p><p> <br> <b> Sometimes, a screen that says that the survey is loading may appear. If this happens, please wait for a couple of seconds. This never takes long. </b> ")
        ,
        newCanvas( "myCanvas", 500, 800)
            .settings.add(0,0, getText("WelcomeText"))
            .print()
        ,
        newButton("finish", "Continue")
            .print()
            .wait()  
     )
    
// Consent
    PennController("Consent",
        newText("ConsentText", "<p> <b> Please read the following carefully! </b> </p><p>I understand that my participation is voluntary and that I am free to withdraw at any time, without giving any reason, and without my rights being affected. </p><p> I understand that any data that are collected will be used and stored anonymously, in accordance with the Data Protection Act. Results are normally presented in terms of groups of individuals. If any individual data were presented, the data would be completely anonymous, without any means of identifying the individuals involved. </p><p> I understand that these data may be used in analyses, publications, and conference presentations by researchers at the University of Cambridge and their collaborators at other research institutions. I give permission for these individuals to have access to these data.</p>")
        ,
        newCanvas( "myCanvas", 300, 600)
            .settings.add(0,0, getText("ConsentText"))
            .print()
        ,
        newButton("I have read an approved the information on this page, continue")
            .settings.center()
            .print()
            .wait()    
        )


// Implementing the Trials
    PennController.Template("trials.csv",
        variable => PennController("trials", 
            newText("sentence", variable.Sentence)
                .settings.center()
                .settings.css("font-size", "30px")
                .settings.bold()
                .print()
            ,
            newImage("picture1", variable.Picture1)
                .settings.size(350,350)
                .settings.css( "border" , "solid 1px black" )
            ,
            newImage("picture2", variable.Picture2)
                .settings.size(350,350)
                .settings.css( "border" , "solid 1px black" )                                   
            ,
            newCanvas(1000,600)
                .settings.center()
                .settings.add(50   , 100,   getImage("picture1"))
                .settings.add(550   , 100,   getImage("picture2"))
                .print()
            ,
            newSelector()
                .settings.add( getImage("picture1") , getImage("picture2") )
//                .shuffle()
                .settings.log()
                .wait()
        )
    .log( "Subject"         , getVar("Subject")         )     
    .log( "Group"           , variable.Group            )
    .log( "StimulusType"    , variable.Stimuli_Type     )                            
    .log( "Sentence"        , variable.Sentence         )
    .log( "Item"            , variable.Item             )
    .log( "Picture1"        , variable.Picture1         )                           
    .log( "Experiment"      , variable.CorPic           ) 
    .log( "Picture2"        , variable.Picture2         )
    .log( "PrimeCondition"  , variable.PrimeCondition   )                            
)

// C-test:
PennController("Ctest",
    newHtml("ctesttext", "ctest.html")
        .settings.log()
        .print()
    ,
    newButton("continue", "Continue")
        .print()
        .wait(
            getHtml("ctesttext").test.complete()
                .failure( getHtml("ctesttext").warn() )
        )                      
)
.log( "Subject", getVar("Subject")) 


// Vragen gegevens:
PennController("QuestionnairePage",
    newHtml("Questionnaire", "Questionnaire.html")
        .settings.log()
        .print()
    ,
    newButton("continue", "Continue")
        .print()
        .wait(
            getHtml("Questionnaire").test.complete()
                .failure( getHtml("Questionnaire").warn() )
        )                      
)
.log( "Subject", getVar("Subject")) 


PennController.SendResults("Send");

    PennController("Closing",
        newText("Explanation", " <strong> PLEASE VERIFY YOUR PARTICIPANT ON PROLIFIC BY CLICKING ON THE LINK ABOVE </strong> <br><br> Dear participant, <br><br> Thank you for your participation! <br><br> In this study, we test and compare monolingual and bilingual language processing. Some of the sentences you read were ambiguous, such as <i> All the apples are not in the boxes </i>. This sentence can be interpreted as meaning that none of the apples are in the boxes, but also that not all (but some) apples are in the boxes. In this experiment, we wanted to test whether Estonian speakers might process these sentences differently than native speakers of English would. By studying this question, we will thus gain insight in how bilinguals may interpret sentences differently than native speakers would; and whether the native language of the bilingual may influence language comprehension in a second language<br><br> Do you want to know more, or receive a report of the results? Please email me on mieke.slim@ugent.be <br><br> <strong> PLEASE VERIFY YOUR PARTICIPANT ON PROLIFIC BY CLICKING ON THE LINK ABOVE </strong>. <br><br> A pop-up may appear, you can click on 'leave site'")
        ,
        newText("Link","<p><a href='https://app.prolific.co/submissions/complete?cc=3D5B600D'>https://app.prolific.co/submissions/complete?cc=3D5B600D</a></p>")
        ,
        newCanvas("Canvas", 500, 600)
            .settings.add(0,0, getText("Link"))
            .settings.add(0,50, getText("Explanation")) 
            .print()
        ,
        newButton("void")
            .wait()
     )
