PennController.ResetPrefix(null);
PennController.DebugOff()
PennController.SetCounter("Counter")

AddHost("https://users.ugent.be/~mslim/SK_images/");

// Check preload of required files:
CheckPreloaded("CheckPreload")

newTrial("Welcome",
    newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
    ,
    newVar("Subject")
        .global()
        .set( getTextInput("Subject") )
    ,
    newHtml("Welcome", "Welcome.html")
        .cssContainer({"width":"720px"})
        .print()
    ,
    newButton("continue", "Järmige")
        .center()
        .print()
        .wait()
     )
     .log( "Subject" , getVar("Subject") )    

newTrial("Consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("continue", "Järmige")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
)

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

newTrial("Questionnaire",
    newHtml("questionnaire_form", "QuestionnareIBEX_bilinguals.html")
        .cssContainer({"width":"720px"})
        .print()
    ,
    newButton("continue", "Järmige")
        .center()
        .print()
        .wait(getHtml("questionnaire_form").test.complete()
                  .failure(getHtml("questionnaire_form").warn())
        )
)

SendResults("Send")

newTrial("FinalPage",
    newText("FinalText", "See on küsimustiku lõpp. Tänan veelkord, et võtsite uuringust osa. Kui teil on küsimusi selle uurimistöö kohta, võtke minuga ühendust emailiaadressil mieke.slim@ugent.be")
    ,
    newCanvas("myCanvas", "60vw" , "60vh")
        .settings.add("center at 50%",0, getText("FinalText"))       
        .print("center at 50%", "top at 25%")   
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)
.setOption("countsForProgressBar",false)
