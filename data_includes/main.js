PennController.ResetPrefix(null);
PennController.DebugOff()
PennController.SetCounter("Counter")
//PennController.Sequence("CheckPreload", "BrowserCheck", "L1Check", "Counter", "Welcome", "Consent", "trials", "Ctest", "QuestionnairePage", "DebriefingPage", "Send", "Closing")

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
        newText("WelcomeText", "Tere ja tänan, et võtate sellest uuringust osa! <br><br>Enne kui nõustute sellest uuringust osa võtma, on oluline, et saaksite aru, miks seda uurimust läbi viiakse ja mida see endast kujutab. Palun võtke aega ja lugege järgnev informatsioon tähelepanelikult läbi ning arutage seda teistega, kui peate seda vajalikuks. Kui midagi jääb arusaamatuks või ebaselgeks võite võtta minuga (Mieke Slim) ühendust. Võtke aega, et otsustada, kas te soovite uuringus osa võtta.<br><br>See uuring on osa minu magistriõppest teoreetilise ja rakendusliku lingvistika erialal Cambridge’i ülikoolis. Selles uuringus keskendun ma mitmele ühekeelse ja kahekeelse keeletöötluse protsessile. Kui soovite rohkem detaile uurimistulemuste kohta, on teil võimalus avaldada oma e-maili aadress. Juunis, kui uurimistöö on valmis, saadan ma teile raporti tulemustega.<br><br>See eksperiment on ühekeelne katse eesti keeles. Selle eksperimendi jaoks on oluline, et eesti keel oleks teie emakeel. Teil palutakse pilt viia kokku lausega. Kui usute, et mitu pilti sobib ühe lausega, valige palun oma spontaane eelistus. Peale seda ülesannet palutakse teil anda lühikene ülevaade oma keeletausta kohta. Palun võtke sellest eksperimendist osa veebibrauseris arvutis, mitte tahvelarvutil või telefonis. Eksperimendist osa võtmine on täielikult vabatahtlik ning keeldumine või poolepealt lõpetamine ei kaasa endaga mingit karistust ega trahvi praegu või tulevikus.<br><br>Teie vastused salvestatakse anonüümselt ning isiklikud andmed on kättesaadavad ainult mulle (Mieke Slim). Uurimustulemus kirjutatakse üles minu magistriõppe väitekirjas ning on võimalus, et seda esitletakse konverentsidel või avaldatakse ajakirjades.<br><br>See projekt on saanud eetilise heakskiidu Research Ethics Committee of the Faculty of Modern and Medieval Languages at the University of Cambridge kommitteelt.Küsimuste korral pöörduge minu poole e-maili teel aadressil mieke.slim@ugent.be.")
        ,
    newCanvas( "myCanvas", "60vw" , "60vh")
        .add(0,0, getText("WelcomeText"))
        .print("center at 50%", "top at 25%")
    ,
    newKey("next", "")
        .wait()  
     )
     .log( "Subject" , getVar("Subject") )    

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
    newButton("continue", "Continue")
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
