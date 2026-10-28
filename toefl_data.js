// Original practice content in the 2026 TOEFL iBT format. Not ETS material.
// MCQ convention: the correct option is written FIRST (index 0); the app shuffles options per question.
const MOCKS = [
{ id:"m1", title:"Practice Test 1",
 reading:{
  ctest:[
   "Teachers in many countries now use digital tools to prepare lessons. These [to|ols] can save [ti|me], but they [al|so] require new [ski|lls]. A teacher [m|ust] check whether [t|he] material is [accu|rate] and suitable [f|or] the age [o|f] [t|he] students.",
   "Sleep plays an important role in learning. During sleep, [t|he] brain organizes [informa|tion] gathered during [t|he] day. Students [w|ho] sleep well [us|ually] remember more [th|an] those who [st|ay] up late. [Howe|ver], many teenagers [d|o] not get [eno|ugh] rest."
  ],
  daily:[
   {text:"NOTICE — Science Building Lift\nThe lift in the Science Building will be closed for repairs from Monday 6 to Wednesday 8 October. Students who need step-free access to the second-floor laboratories should contact the Student Support Office by Friday so that their classes can be moved to the ground floor. We apologise for any inconvenience.",
    qs:[{q:"What is the main purpose of the notice?",o:["To announce a temporary closure and an arrangement for affected students","To ask students to help repair the lift","To move all science classes permanently","To advertise a new laboratory"]},
        {q:"What should a student who cannot use the stairs do?",o:["Contact the Student Support Office by Friday","Wait until Wednesday","Go to the second floor early","Email the science teacher"]}]},
   {text:"Hi Amina — the book club is meeting at my place this Thursday instead of the library, because the library is closing early for staff training. Same time, 6 p.m. I'll make tea. Could you bring the extra copies of the novel you borrowed? See you then! — Grace",
    qs:[{q:"Why has the meeting place changed?",o:["The library is closing early","Grace wants to make tea","Amina has the books","The novel was not available"]},
        {q:"What does Grace ask Amina to do?",o:["Bring the extra copies of the novel","Arrive at 5 p.m.","Return the books to the library","Choose the next book"]},
        {q:"What can be inferred about the meeting?",o:["It will start at the usual time","It will be shorter than usual","It has been cancelled","It will be held online"]}]}
  ],
  academic:[
   {title:"The Spacing Effect",text:"In the 1880s, the German psychologist Hermann Ebbinghaus tested his own memory by learning lists of nonsense syllables. He found that information is forgotten quickly at first and then more slowly — a pattern now called the forgetting curve. He also noticed something more useful: when he spread his study sessions over several days, he needed fewer repetitions in total to remember a list than when he studied it all at once. This finding, known as the spacing effect, has been confirmed in hundreds of later studies with learners of all ages.\n\nWhy does spacing work? One explanation is that each time we return to material after a delay, we must work harder to retrieve it, and this effort strengthens the memory. Cramming feels productive because the material seems familiar, but that familiarity fades within days. Researchers therefore recommend combining spacing with retrieval practice — testing oneself rather than rereading.\n\nDespite the evidence, spacing is rarely built into school timetables. Textbooks usually present each topic once, in a single block, and move on. Some educators argue that curricula should instead revisit key ideas at increasing intervals throughout the year.",
    qs:[{q:"What is the passage mainly about?",o:["Spreading out study improves long-term memory, yet schools seldom use it","Ebbinghaus invented nonsense syllables","Cramming is the best method before exams","Textbooks should include more topics"]},
        {q:"What did Ebbinghaus notice when he spread out his study sessions?",o:["He needed fewer repetitions in total","He forgot the lists faster","He preferred nonsense syllables","He could study only in the morning"]},
        {q:"The word \"confirmed\" in paragraph 1 is closest in meaning to",o:["supported","questioned","ignored","simplified"]},
        {q:"Why does cramming \"feel productive\"?",o:["It produces a sense of familiarity that is only temporary","It requires hard retrieval","Researchers recommend it","Its effects last for years"]},
        {q:"What is the purpose of the final paragraph?",o:["To contrast research evidence with common school practice","To describe Ebbinghaus's later life","To argue that textbooks are too short","To explain the forgetting curve"]}]},
   {title:"Phones and Farm Prices",text:"Across East Africa, small-scale farmers have long depended on middlemen for information about crop prices. Because a farmer could not easily learn what buyers in distant markets were paying, traders who travelled between villages often bought produce cheaply and sold it at a large profit. The spread of basic mobile phones in the 2000s changed this situation. Farmers began to receive market prices by text message, and several studies found that the gap between prices in different markets narrowed as a result.\n\nThe benefits, however, were not shared equally. Farmers who owned phones and could read text messages gained the most, while older farmers and those with little schooling often continued to rely on traders. Some researchers concluded that technology alone does not reduce inequality; it tends to help first those who already have the skills to use it.\n\nMore recent programmes have tried to address this problem by pairing information services with training, often delivered through local farmer groups rather than by outside experts.",
    qs:[{q:"What is the passage mainly about?",o:["Phones improved price information, but the gains depended on users' skills","Mobile phones eliminated middlemen completely","Traders should be banned from villages","Farmer groups are more useful than phones"]},
        {q:"What happened to price differences between markets?",o:["They became smaller","They increased","They disappeared entirely","They stayed the same"]},
        {q:"The word \"narrowed\" is closest in meaning to",o:["decreased","widened","moved","stabilised"]},
        {q:"The researchers mentioned in paragraph 2 would most likely agree that",o:["new technology can widen gaps unless skills are also developed","older farmers do not want phones","text messages are too expensive","traders offer fairer prices"]},
        {q:"Why does the author mention local farmer groups?",o:["As an example of an approach that combines information with training","To show that experts are unnecessary","To criticise mobile phone companies","To describe how prices are set"]}]}
  ]},
 listening:{
  responses:[
   {say:"Do you mind if I open the window?",o:["Not at all, go ahead.","Yes, it's on the table.","I opened it yesterday.","The window is blue."]},
   {say:"Have you finished the reading for Thursday's seminar?",o:["Almost — I've got one chapter left.","The seminar room is upstairs.","Thursday is my favourite day.","I read it to you."]},
   {say:"Why don't we meet in the library instead?",o:["Good idea — it's quieter there.","Because it's closed.","I don't know my card number.","Yes, I met her there."]},
   {say:"The printer's out of paper again.",o:["I'll let the office know.","Print it in colour.","Paper is made from trees.","The printer is new."]},
   {say:"Could you tell me when the next bus leaves?",o:["In about ten minutes, from stop B.","It's a long trip.","I usually walk.","Yes, I could."]},
   {say:"I didn't see you at the lecture this morning.",o:["I overslept, unfortunately.","The lecture was about history.","See you in the morning.","I'll give a lecture."]},
   {say:"Would you rather work in pairs or on your own?",o:["In pairs, if that's all right.","I have two pairs.","On Tuesday.","It's my own work."]},
   {say:"Professor Ali has moved her office hours to Friday.",o:["Oh, thanks — I'll go then.","She's a good professor.","Friday is too far to walk.","I moved house on Friday."]}
  ],
  convos:[
   {lines:[["Student","Hi, I wanted to ask about dropping my statistics course."],["Advisor","Sure. Can I ask why?"],["Student","I'm working twenty hours a week this term, and I'm falling behind."],["Advisor","I see. The deadline to drop without a penalty is this Friday. But have you thought about the tutoring centre? It's free, and they have evening sessions."],["Student","I didn't know they were open in the evening."],["Advisor","Until eight, Monday to Thursday. Statistics is required for your degree, so if you drop it now, you'll have to take it next year anyway."],["Student","Then maybe I'll try the tutoring first and decide by Thursday."],["Advisor","That sounds sensible. Come back and see me if it doesn't help."]],
    qs:[{q:"Why is the student thinking of dropping the course?",o:["She is working many hours and falling behind","She doesn't like statistics","The course is not required","The class starts too early"]},
        {q:"What will the student probably do next?",o:["Try the tutoring centre before deciding","Drop the course today","Change her degree","Stop working"]}]},
   {lines:[["Man","Did you get my message about the presentation?"],["Woman","Yes — you want to swap slides with Daniel?"],["Man","Right. He knows more about the survey data, so it makes sense for him to present the results."],["Woman","Fine by me, but then you'll need to do the introduction. Are you okay with that?"],["Man","Actually, I'd prefer that. I'm better at explaining the background."],["Woman","Great. Let's tell Daniel tonight so he has time to practise."]],
    qs:[{q:"What are the speakers mainly discussing?",o:["Changing who presents which part","Collecting survey data","Cancelling the presentation","Finding a new group member"]},
        {q:"Why should Daniel present the results?",o:["He knows the survey data best","He wrote the introduction","He will be absent tonight","He asked to present them"]}]}
  ],
  announce:[
   {text:"Good morning, everyone. A quick reminder before we start: the deadline for the research proposal has been moved from October the tenth to October the seventeenth, because several of you asked for more time to finish your interviews. However, please note that the proposal must now include a one-page summary of your interview findings. Submit everything through the online portal, not by email. If you have questions, I'll hold extra office hours on Wednesday afternoon.",
    qs:[{q:"Why was the deadline changed?",o:["Students needed more time for their interviews","The portal was broken","The professor will be away","The proposal format is new"]},
        {q:"What is new about the proposal?",o:["It must include a one-page summary of interview findings","It must be sent by email","It is shorter than before","It must be done in pairs"]}]}
  ],
  talks:[
   {text:"Today I want to talk about why cities are often warmer than the countryside around them. This is called the urban heat island effect. There are several causes. First, materials like concrete and asphalt absorb heat during the day and release it slowly at night, so cities stay warm after sunset. Second, cities have fewer trees and less open soil. Plants cool the air by releasing water through their leaves — a process called transpiration — so when we remove vegetation, we lose that natural cooling. Third, cars, air conditioners and factories all produce heat directly. What does this mean in practice? During heat waves, city residents, especially older people, face greater health risks. That's why many cities are now planting trees and painting roofs white to reflect sunlight.",
    qs:[{q:"What is the lecture mainly about?",o:["Why cities are warmer than surrounding areas","How roads are built","The history of air conditioning","How weather is forecast"]},
        {q:"According to the professor, how do plants cool the air?",o:["By releasing water through their leaves","By blocking the wind","By absorbing concrete","By producing shade at night"]},
        {q:"Why does the professor mention white roofs?",o:["As an example of a response to the effect","To describe old buildings","To explain transpiration","To show that paint is expensive"]}]},
   {text:"Let's look at an idea from education research called peer tutoring — students teaching other students. You might expect only the student being tutored to benefit. But studies repeatedly show that the tutors learn a great deal too. Why? To explain something, the tutor has to organise the knowledge clearly and notice the gaps in their own understanding. Researchers sometimes call this learning by teaching. There's a condition, though. The benefit is strongest when tutors receive some training in how to ask questions, rather than simply giving answers. Untrained tutors tend to just tell the answer, and then neither student thinks very hard.",
    qs:[{q:"What finding does the professor describe as surprising?",o:["Tutors also learn a great deal","Tutored students learn nothing","Peer tutoring is expensive","Teachers dislike peer tutoring"]},
        {q:"Why do tutors benefit?",o:["Explaining forces them to organise knowledge and find gaps","They are paid for tutoring","They study less","They avoid exams"]},
        {q:"What condition makes peer tutoring most effective?",o:["Tutors are trained to ask questions","Tutors are much older","Sessions are very long","It is used only in mathematics"]}]}
  ]},
 writing:{
  build:[
   {c:"Where did you leave the report?",a:["I left it","on the desk","next to","the printer"]},
   {c:"Why were you late this morning?",a:["The bus","broke down","on the way","to campus"]},
   {c:"What did the professor say about the essay?",a:["She said","that we need","to add","more evidence"]},
   {c:"Have you decided on a topic?",a:["I'm thinking","of writing","about","school meals"]},
   {c:"When is the library open?",a:["It is open","from eight","until ten","on weekdays"]},
   {c:"Did you enjoy the field trip?",a:["It was","more interesting","than I","expected"]},
   {c:"How can I improve my speaking?",a:["You should","practise","every day","with a partner"]},
   {c:"What happened at the meeting?",a:["They agreed","to postpone","the decision","until next week"]}
  ],
  email:"You borrowed a camera from your classmate, Jonah, for a weekend trip. While you were using it, the lens cap was lost.\nWrite an email to Jonah. In your email:\n• explain what happened\n• apologise and offer a solution\n• ask when you can return the camera",
  disc:{prof:"Some people argue that schools should replace printed textbooks entirely with digital materials. Others believe printed books are still essential. Which view do you support, and why?",
   posts:[["Kofi","Digital materials can be updated every year and cost less to distribute. In a fast-changing world, printed textbooks are out of date before students even open them."],["Laura","I disagree. Many students do not have reliable devices or electricity at home. If we remove printed books, the students who already have the least will fall further behind."]]}
 },
 speaking:{
  repeat:["The library will close early on Friday.","Please hand in your assignment before the end of the week.","The cafeteria offers a vegetarian option every day at lunch.","If you miss the bus, the next one leaves in twenty minutes.","Students who want to join the debate club should register online.","The professor asked us to read the first two chapters before Monday's class.","Because of the heavy rain, the outdoor concert has been moved to the main hall."],
  interview:["Tell me about a place where you like to study, and explain why.","Some people prefer to learn alone; others prefer to learn in groups. Which do you prefer, and why?","Describe a teacher who influenced you.","Do you think technology makes students more independent learners? Why or why not?"]
 }},
{ id:"m2", title:"Practice Test 2",
 reading:{
  ctest:[
   "Clean water is essential for health. In many [reg|ions], [peo|ple] walk long [dist|ances] to collect it. [Th|is] takes time that [chil|dren] could spend at [sch|ool]. Simple solutions, [su|ch] as rainwater tanks, [c|an] reduce this burden [consi|derably] and improve [atten|dance].",
   "Bees are important for agriculture. They carry [pol|len] from one [flo|wer] [t|o] another, which allows [pla|nts] to produce fruit. [Rec|ently], bee populations have [decl|ined] in many parts [o|f] the world. Scientists [bel|ieve] that pesticides and [hab|itat] loss are [ma|jor] causes."
  ],
  daily:[
   {text:"Dear residents,\nWater will be switched off on Saturday between 9 a.m. and 1 p.m. while the main pipe is replaced. Please store enough water for cooking and washing. Residents who need help carrying water containers can ask at the reception desk. Thank you for your patience.\n— Building Management",
    qs:[{q:"What is the purpose of the message?",o:["To inform residents of a planned water interruption","To ask residents to replace pipes","To announce a new reception desk","To complain about water use"]},
        {q:"Who should go to the reception desk?",o:["Residents who need help carrying water","Everyone, on Saturday","Residents with broken pipes","New residents"]}]},
   {text:"Weekend Kiswahili for Beginners\nLearn everyday conversation in eight Saturday mornings. Small groups (maximum 8). Classes start 11 October at the Community Centre, Room 3. Fee: $40, including all materials. Register by 5 October — places are limited.",
    qs:[{q:"What is included in the fee?",o:["All materials","Lunch","A certificate exam","Transport"]},
        {q:"What can be inferred about the course?",o:["It may be full before 5 October","Classes are held online","It is for advanced speakers","It runs on weekday evenings"]},
        {q:"When do classes begin?",o:["11 October","5 October","8 October","3 October"]}]}
  ],
  academic:[
   {title:"Learning to Read in the Mother Tongue",text:"In many multilingual countries, children begin school in a language they do not speak at home. For decades, education systems assumed that early exposure to an international language would help children master it quickly. Research over the past thirty years suggests otherwise. Children who first learn to read in their mother tongue generally develop stronger reading skills, and they later transfer those skills to a second language more successfully than children who start directly in the second language.\n\nThe explanation lies partly in comprehension. A child who understands the words on the page can focus on the process of reading itself — linking sounds to letters and building meaning. A child who is simultaneously learning a new language and learning to read faces two difficult tasks at once.\n\nImplementing mother-tongue programmes is not simple, however. Governments must produce materials in many languages and train teachers to teach in them. Where resources are limited, some countries have chosen a transition model: instruction begins in the local language and gradually shifts to the international language over several years.",
    qs:[{q:"What is the passage mainly about?",o:["Beginning literacy in the home language tends to produce better outcomes","Children should never learn international languages","Multilingual countries have too many languages","Reading is easier than speaking"]},
        {q:"According to the passage, what do children who learn to read in their mother tongue later do?",o:["Transfer their reading skills to a second language more successfully","Avoid learning a second language","Read more slowly","Forget their mother tongue"]},
        {q:"The word \"simultaneously\" is closest in meaning to",o:["at the same time","carefully","rarely","later"]},
        {q:"What are the \"two difficult tasks\" in paragraph 2?",o:["Learning a new language and learning to read","Speaking and writing","Mathematics and reading","Listening and watching"]},
        {q:"What is the purpose of the final paragraph?",o:["To discuss practical challenges and one response to them","To reject the research","To describe teachers' salaries","To repeat the first paragraph"]}]},
   {title:"Measuring Economies from Space",text:"How can researchers measure economic activity in places where official statistics are unreliable? One creative answer comes from satellites. At night, satellites photograph the Earth's surface, recording how much artificial light each area produces. Because electricity use rises with income, brighter regions tend to be wealthier, and changes in brightness over time can indicate economic growth or decline.\n\nEconomists have used night-light data to study questions that would otherwise be difficult to answer — for example, whether new roads increase activity in nearby towns. The data has clear advantages: it is available for almost the entire world, it is updated frequently, and it cannot be manipulated by governments.\n\nYet night lights have limitations. In very poor rural areas, many households have no electricity at all, so a region may appear completely dark whether its residents are growing richer or not. Agricultural activity, which produces little light, is also largely invisible. For these reasons, most researchers treat night-light data as a supplement to surveys rather than a replacement.",
    qs:[{q:"What is the passage mainly about?",o:["Night-light data is a useful but imperfect measure of economic activity","Satellites can photograph cities","Governments manipulate statistics","New roads always increase growth"]},
        {q:"Why do brighter regions tend to be wealthier?",o:["Electricity use rises with income","More satellites pass over them","They have fewer clouds","They are closer to the equator"]},
        {q:"The word \"manipulated\" is closest in meaning to",o:["controlled dishonestly","improved","measured","published"]},
        {q:"Which is a limitation of night-light data?",o:["Very poor areas may look dark whether or not incomes change","It is rarely updated","It covers only Europe","It is very expensive"]},
        {q:"What is the author's view of night-light data?",o:["It is best used alongside surveys","It should replace surveys","Surveys are unnecessary","Agriculture should be ignored"]}]}
  ]},
 listening:{
  responses:[
   {say:"Can I borrow your notes from yesterday's class?",o:["Sure, I'll send you a photo of them.","I borrowed them too early.","Class was in room five.","They're not very long."]},
   {say:"Is it all right if I bring a friend to the workshop?",o:["As long as they register first.","The workshop is on Tuesday.","My friend is a doctor.","Yes, I brought it."]},
   {say:"I can't find my student ID anywhere.",o:["Have you checked your jacket pocket?","IDs are important.","I found mine yesterday.","Nowhere is far."]},
   {say:"How long does it take to get to the museum?",o:["About half an hour on foot.","It opens at nine.","It's a history museum.","I took a long time."]},
   {say:"Shall we start the meeting, or wait for Maria?",o:["Let's give her five more minutes.","Maria is my sister.","The meeting was good.","I'll wait for the bus."]},
   {say:"You look tired today.",o:["I was up late finishing my essay.","I'll look tomorrow.","Today is Monday.","Thanks, it's new."]},
   {say:"Did the lab results come back yet?",o:["Not yet — maybe this afternoon.","The lab is on the third floor.","I came back yesterday.","Results are important."]},
   {say:"Would you like me to check your presentation before tomorrow?",o:["That would be really helpful, thanks.","I presented it yesterday.","Tomorrow is Thursday.","I like presents."]}
  ],
  convos:[
   {lines:[["Student","Hi, I need a book for my history paper, but the catalogue says it's checked out."],["Librarian","Let me look. Yes, it's due back next Tuesday. You can place a hold on it, and we'll email you when it returns."],["Student","My paper is due on Monday, though."],["Librarian","In that case, we have an electronic version. You can read it online with your student login, but you can't download it."],["Student","Reading online is fine. Can I print a few pages?"],["Librarian","Up to twenty pages, yes."]],
    qs:[{q:"What is the student's problem?",o:["The book she needs will not return before her paper is due","She has lost her login","The library is closed","She has not chosen a topic"]},
        {q:"What does the librarian suggest?",o:["Reading the electronic version online","Waiting until Tuesday","Buying the book","Changing the topic"]}]},
   {lines:[["Woman","Our electricity bill was much higher this month."],["Man","It's probably the heater. I've been using it every night."],["Woman","Could you try wearing a sweater instead, at least in the evenings?"],["Man","Sure. And maybe we should switch off the water heater during the day. We only need hot water in the mornings."],["Woman","Good idea. Let's compare next month's bill and see if it helps."]],
    qs:[{q:"What are the speakers mainly discussing?",o:["Ways to reduce their electricity bill","Buying a new heater","Paying the rent","Moving to a new flat"]},
        {q:"What do they plan to do next month?",o:["Compare the bill","Buy sweaters","Call the landlord","Turn off all power"]}]}
  ],
  announce:[
   {text:"Attention, all first-year students. The orientation tour of the science laboratories has been moved from this afternoon to tomorrow at ten o'clock, because the safety inspector is visiting today. Please wear closed shoes, as sandals are not permitted in the labs. The tour will begin at the main entrance of the Science Building and will take about an hour.",
    qs:[{q:"Why was the tour moved?",o:["The safety inspector is visiting today","It is raining","The professor is ill","The labs are closed permanently"]},
        {q:"What must students do?",o:["Wear closed shoes","Bring a lab coat","Register online","Arrive at noon"]}]}
  ],
  talks:[
   {text:"Today's topic is keystone species. In architecture, a keystone is the stone at the top of an arch that holds the others in place. Ecologists borrowed the term for species that have a much larger effect on their environment than their numbers would suggest. The classic example comes from the Pacific coast of North America. Sea otters eat sea urchins, and sea urchins eat kelp — large seaweed that forms underwater forests. When otters were hunted almost to extinction, the urchin population exploded, and the kelp forests disappeared. Many fish that depended on the kelp disappeared too. When otters were protected and returned, the kelp forests recovered. So removing one species changed the entire ecosystem.",
    qs:[{q:"What is the lecture mainly about?",o:["What a keystone species is, illustrated with an example","The architecture of arches","How otters were hunted","The fishing industry"]},
        {q:"Why does the professor mention an arch?",o:["To explain where the term comes from","To describe coastal buildings","To show how kelp grows","To compare otters and fish"]},
        {q:"What happened when the otters disappeared?",o:["Urchins increased and the kelp forests disappeared","The kelp grew faster","Fish populations increased","Urchins disappeared too"]}]},
   {text:"Let's talk about feedback in the classroom. Many teachers give students a grade along with written comments. It seems helpful — students get both a score and advice. But one well-known study found something surprising. Students who received only comments improved more on the next task than students who received a grade and comments together. The researchers suggested that when a grade is present, students focus on the number and pay little attention to the advice. So some schools now return comments first, and give grades only after students have revised their work.",
    qs:[{q:"What did the study find?",o:["Comments alone led to more improvement than grades plus comments","Grades always improve motivation","Students ignore all comments","Teachers dislike grading"]},
        {q:"How did the researchers explain the finding?",o:["When a grade is present, students focus on it and ignore the advice","The comments were too long","The grades were unfair","The teachers were too busy"]},
        {q:"What do some schools now do?",o:["Return comments first and give grades after revision","Stop writing comments","Give only grades","Grade every task twice"]}]}
  ]},
 writing:{
  build:[
   {c:"Why didn't you come to the party?",a:["I had to","finish","a report","for work"]},
   {c:"Where can I buy a notebook?",a:["There is","a small shop","near","the main gate"]},
   {c:"What time does the seminar start?",a:["It starts","at two","but you should","arrive early"]},
   {c:"Did you understand the lecture?",a:["Most of it","but the last part","was","confusing"]},
   {c:"How was your weekend?",a:["It was","relaxing","because I","stayed at home"]},
   {c:"Who is organising the trip?",a:["The student union","is organising it","with help","from the department"]},
   {c:"Can you help me with this form?",a:["Of course","which part","do you","find difficult"]},
   {c:"What did you think of the book?",a:["I found it","hard to read","but","worth the effort"]}
  ],
  email:"Your study group meets every Wednesday evening, but you have just started a part-time job that begins at 6 p.m. on Wednesdays.\nWrite an email to the group leader, Priya. In your email:\n• explain the problem\n• suggest another day or time\n• offer to share your notes or tasks in the meantime",
  disc:{prof:"In many countries, governments are considering using artificial intelligence to help teachers prepare lessons. Is this a good use of public money? Explain your view.",
   posts:[["Musa","Yes. Teachers spend hours every week preparing materials. If AI can save that time, teachers can give more attention to individual students."],["Sofia","I'm not convinced. The money might be better spent on hiring more teachers. AI tools can make mistakes, and teachers still have to check everything."]]}
 },
 speaking:{
  repeat:["The bookstore is on the left, next to the bank.","Please turn off your phones during the exam.","Registration for next semester opens on Monday morning.","The swimming pool will be closed for cleaning this weekend.","If you have questions about your grade, email the teaching assistant.","Students can borrow laptops from the library for up to three days.","The guest speaker, who works for an international charity, will talk about clean water projects."],
  interview:["What kind of work do you find most satisfying, and why?","Tell me about a time you had to solve a problem with limited resources.","Do you think people should volunteer in their communities? Why or why not?","How do you think schools will change in the next ten years?"]
 }}
];
