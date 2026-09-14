let selectedLevel = localStorage.getItem("passCscSelectedLevel") || "Professional";
let current = 0;
let answers = {};
let activeQuestions = [];
let activeMode = "Diagnostic";
let lastWeakSkill = "Percentage";
const DIAGNOSTIC_QUESTION_COUNT = 15;
const PAYMENT_STORE_KEY = "passCscPayments";
const ADMIN_PASSWORD = "PassCSCAdmin2026";
let lastSubmittedPayment = null;
const examCoverage = {
 Professional:{
  items:170,
  time:"3 hours 10 minutes",
  diagnosticPlan:[
   {name:"Verbal Ability",count:4},
   {name:"Numerical Ability",count:4},
   {name:"Analytical Ability",count:4},
   {name:"General Information",count:3}
  ],
  mockPlan:[
   {name:"Verbal Ability",count:45},
   {name:"Numerical Ability",count:40},
   {name:"Analytical Ability",count:45},
   {name:"General Information",count:40}
  ],
  categories:[
   {name:"Verbal Ability",topics:["English and Filipino grammar","Vocabulary, synonyms, antonyms, and context clues","Reading comprehension using main idea, details, inference, tone, and purpose","Analogy and paragraph organization"]},
   {name:"Numerical Ability",topics:["Basic arithmetic, fractions, decimals, percentages, and order of operations","Ratio and proportion, percent change, and word problems","Number series, sequences, data summary, and measurements"]},
   {name:"Analytical Ability",topics:["Syllogism and logical reasoning","Data interpretation from tables, charts, and graphs","Problem solving, pattern recognition, and abstract reasoning"]},
   {name:"General Information",topics:["Philippine Constitution, Bill of Rights, citizenship, and branches of government","RA 6713, Data Privacy Act, Ease of Doing Business, and public service laws","Peace, human rights, environment, disaster readiness, and current public issues"]}
  ]
 },
 Subprofessional:{
  items:165,
  time:"2 hours 40 minutes",
  diagnosticPlan:[
   {name:"Verbal Ability",count:4},
   {name:"Numerical Ability",count:4},
   {name:"Clerical Ability",count:4},
   {name:"General Information",count:3}
  ],
  mockPlan:[
   {name:"Verbal Ability",count:45},
   {name:"Numerical Ability",count:40},
   {name:"Clerical Ability",count:40},
   {name:"General Information",count:40}
  ],
  categories:[
   {name:"Verbal Ability",topics:["English and Filipino grammar","Vocabulary, synonyms, antonyms, and context clues","Reading comprehension using main idea, details, inference, tone, and purpose","Analogy and paragraph organization"]},
   {name:"Numerical Ability",topics:["Basic arithmetic, fractions, decimals, percentages, and order of operations","Ratio and proportion, percent change, and word problems","Number series, sequences, data summary, and measurements"]},
   {name:"Clerical Ability",topics:["Alphabetical filing, indexing, and arranging names","Coding and decoding office records","Spelling of common words and work terms","Checking and comparing names, numbers, codes, and entries"]},
   {name:"General Information",topics:["Philippine Constitution, Bill of Rights, citizenship, and branches of government","RA 6713, Data Privacy Act, Ease of Doing Business, and public service laws","Peace, human rights, environment, disaster readiness, and current public issues"]}
  ]
 }
};

const questions = [
 {cat:"Verbal Ability",q:"Choose the word closest in meaning to METICULOUS.",choices:["Careless","Thorough","Impatient","Ordinary"],a:1,skill:"Vocabulary",tech:"Meticulous means very careful and precise. Think: 'meticulous = detailed/thorough.'"},
 {cat:"Verbal Ability",q:"Neither the manager nor his assistants ___ available during the meeting.",choices:["was","is","were","has been"],a:2,skill:"Subject–Verb Agreement",tech:"With neither...nor, the verb agrees with the nearer subject. 'Assistants' is plural, so use 'were'."},
 {cat:"Verbal Ability",q:"Reading Comprehension: Many employees arrive early not because they are required to, but because they want quiet time to prepare before office work begins. Based on the passage, why do many employees arrive early?",choices:["They are required by policy","They want quiet preparation time","They want to leave early","They have no work to do"],a:1,skill:"Reading Comprehension",tech:"Use Q-R-A: read the Question first, then Read only for the needed clue, then Answer. Here, the clue says they arrive early because they want quiet time to prepare. Eliminate choices not stated in the passage."},
 {cat:"Numerical Ability",q:"25% of 1,200 is:",choices:["250","275","300","325"],a:2,skill:"Percentage",tech:"Fastest method: 25% = 1/4. Divide 1,200 by 4 = 300. No multiplication needed."},
 {cat:"Numerical Ability",q:"A ₱2,500 item is discounted by 20%. What is the sale price?",choices:["₱1,500","₱1,800","₱2,000","₱2,300"],a:2,skill:"Percentage",tech:"20% = 1/5. ₱2,500 ÷ 5 = ₱500 discount. ₱2,500 − ₱500 = ₱2,000."},
 {cat:"Numerical Ability",q:"Find the next number: 2, 6, 12, 20, 30, ___",choices:["36","40","42","44"],a:2,skill:"Number Sequence",tech:"Look at the differences: +4, +6, +8, +10. Next is +12, so 30 + 12 = 42."},
 {cat:"Analytical Ability",q:"All accountants are employees. All employees have ID cards. Therefore:",choices:["Some accountants have no ID","All accountants have ID cards","All ID holders are accountants","No conclusion can be made"],a:1,skill:"Syllogism",tech:"Use the chain: Accountants → Employees → ID cards. Therefore every accountant must have an ID card."},
 {cat:"Analytical Ability",q:"Ana is older than Ben. Ben is older than Carlo. David is older than Ana. Who is the oldest?",choices:["Ana","Ben","Carlo","David"],a:3,skill:"Ordering Logic",tech:"Convert statements into one order: David > Ana > Ben > Carlo. The leftmost is the oldest."},
 {cat:"General Information",q:"Which branch of the Philippine government interprets laws?",choices:["Executive","Legislative","Judicial","Constitutional Commissions"],a:2,skill:"Constitution",tech:"Remember the 3 core roles: Legislative makes laws, Executive enforces laws, Judicial interprets laws."},
 {cat:"General Information",q:"R.A. 6713 primarily concerns:",choices:["Government procurement","Ethical standards for public officials and employees","Election procedures","Local taxation"],a:1,skill:"RA 6713",tech:"RA 6713 = Code of Conduct and Ethical Standards for Public Officials and Employees."},
 {cat:"General Information",q:"Public office is a:",choices:["Private privilege","Public trust","Personal right","Political reward"],a:1,skill:"Constitution",tech:"Memorize the constitutional phrase: 'Public office is a public trust.'"},
 {cat:"Verbal Ability",q:"Choose the word opposite in meaning to RELUCTANT.",choices:["Unwilling","Eager","Hesitant","Doubtful"],a:1,skill:"Vocabulary",tech:"Reluctant means unwilling or hesitant. The opposite is eager."},
 {cat:"Verbal Ability",q:"The report was submitted ___ the deadline.",choices:["on","at","in","for"],a:0,skill:"Grammar",tech:"Use 'on' for specific days or deadlines: submitted on the deadline."},
 {cat:"Verbal Ability",q:"Reading Comprehension: The new policy reduced paper use because employees now submit forms online. What was the effect of the policy?",choices:["Paper use increased","Paper use decreased","Employees stopped working","Forms were removed completely"],a:1,skill:"Reading Comprehension",tech:"Look for cause and effect. The passage says the policy reduced paper use, so choose the effect directly stated."},
 {cat:"Verbal Ability",q:"Reading Comprehension: Liza reviewed the instructions twice before answering because she wanted to avoid careless mistakes. What can be inferred about Liza?",choices:["She was careless","She prepared carefully","She ignored the test","She finished first"],a:1,skill:"Reading Comprehension",tech:"For inference questions, pick the answer supported by the passage. Reviewing twice to avoid mistakes shows careful preparation."},
 {cat:"Numerical Ability",q:"10% of 850 is:",choices:["8.5","75","85","95"],a:2,skill:"Percentage",tech:"10% means move the decimal one place left: 850 becomes 85."},
 {cat:"Numerical Ability",q:"If 3 pens cost ₱45, how much do 5 pens cost at the same rate?",choices:["₱60","₱65","₱70","₱75"],a:3,skill:"Ratio and Proportion",tech:"Find unit price first: ₱45 ÷ 3 = ₱15 per pen. Then ₱15 × 5 = ₱75."},
 {cat:"Numerical Ability",q:"A worker earns ₱600 per day. How much will the worker earn in 6 days?",choices:["₱3,000","₱3,200","₱3,600","₱4,000"],a:2,skill:"Basic Operations",tech:"Multiply daily pay by days: 600 × 6 = 3,600."},
 {cat:"Numerical Ability",q:"Find the next number: 5, 10, 20, 40, ___",choices:["45","60","70","80"],a:3,skill:"Number Sequence",tech:"Each number is doubled. 40 × 2 = 80."},
 {cat:"Analytical Ability",q:"If all clerks are employees and some employees are supervisors, which statement must be true?",choices:["All clerks are supervisors","Some supervisors are clerks","All clerks are employees","No employees are clerks"],a:2,skill:"Syllogism",tech:"Only follow what is guaranteed. The first statement directly says all clerks are employees."},
 {cat:"Analytical Ability",q:"Maria is taller than Jose. Jose is taller than Nina. Who is the shortest?",choices:["Maria","Jose","Nina","Cannot be determined"],a:2,skill:"Ordering Logic",tech:"Write the order: Maria > Jose > Nina. The last one is shortest."},
 {cat:"Analytical Ability",q:"Carlo finished before Ben. Ana finished after Ben. Dana finished before Carlo. Who finished first?",choices:["Ana","Ben","Carlo","Dana"],a:3,skill:"Ordering Logic",tech:"Convert to order: Dana before Carlo before Ben before Ana. The first is Dana."},
 {cat:"Analytical Ability",q:"Red box is heavier than blue. Green is lighter than blue. Yellow is heavier than red. Which is the heaviest?",choices:["Green","Blue","Red","Yellow"],a:3,skill:"Ordering Logic",tech:"Write the chain: Yellow > Red > Blue > Green. The heaviest is Yellow."},
 {cat:"Analytical Ability",q:"Nina sits to the left of Omar. Pia sits to the right of Omar. Who is in the middle?",choices:["Nina","Omar","Pia","Cannot be determined"],a:1,skill:"Ordering Logic",tech:"Place them left to right: Nina, Omar, Pia. Omar is in the middle."},
 {cat:"Analytical Ability",q:"A is older than B. C is younger than B. D is older than A. Who is youngest?",choices:["A","B","C","D"],a:2,skill:"Ordering Logic",tech:"Build the order: D > A > B > C. The youngest is C."},
 {cat:"Analytical Ability",q:"Book is to reading as fork is to:",choices:["Writing","Eating","Drawing","Sleeping"],a:1,skill:"Analogy",tech:"Identify the use relationship. A book is used for reading; a fork is used for eating."},
 {cat:"Analytical Ability",q:"Complete the pattern: A, C, E, G, ___",choices:["H","I","J","K"],a:1,skill:"Pattern Recognition",tech:"Skip one letter each time: A, C, E, G, I."},
 {cat:"General Information",q:"Which document is considered the highest law of the Philippines?",choices:["Civil Code","Labor Code","Constitution","Local ordinance"],a:2,skill:"Constitution",tech:"The Constitution is the supreme or highest law of the land."},
 {cat:"General Information",q:"Which right protects a person from being forced to testify against oneself?",choices:["Right to education","Right against self-incrimination","Right to travel","Right to assemble"],a:1,skill:"Bill of Rights",tech:"Remember the phrase: no person shall be compelled to be a witness against himself."},
 {cat:"General Information",q:"The Ombudsman mainly investigates complaints against:",choices:["Private companies only","Public officials and employees","Foreign citizens","Students"],a:1,skill:"Accountability",tech:"The Ombudsman handles complaints involving public officials and employees."},
 {cat:"Clerical Ability",q:"Arrange alphabetically: Santos, Reyes, Rivera, Ramos.",choices:["Ramos, Reyes, Rivera, Santos","Reyes, Ramos, Rivera, Santos","Ramos, Rivera, Reyes, Santos","Santos, Ramos, Reyes, Rivera"],a:0,skill:"Alphabetical Filing",tech:"Compare letter by letter. All R names come before Santos; among Ramos, Reyes, Rivera: Ra comes before Re, then Ri."},
 {cat:"Clerical Ability",q:"Which entry is filed first alphabetically?",choices:["Delos Santos","Dela Cruz","De Vera","Domingo"],a:1,skill:"Alphabetical Filing",tech:"Compare after De. Dela comes before Delos, De Vera, and Domingo."},
 {cat:"Clerical Ability",q:"Find the correctly coded item: 48291 copied as ____.",choices:["48219","48291","48921","42891"],a:1,skill:"Attention to Detail",tech:"Check digit by digit from left to right. Only 48291 matches exactly."},
 {cat:"Clerical Ability",q:"Which pair is exactly the same?",choices:["CSC-2841 / CSC-2481","PRC-7702 / PRC-7702","BIR-1198 / B1R-1198","LTO-5630 / LTO-5360"],a:1,skill:"Attention to Detail",tech:"Scan each character. PRC-7702 matches exactly; the others have swapped or changed characters."},
 {cat:"Clerical Ability",q:"A file labeled Mendoza, Ana should be placed under which surname?",choices:["Ana","Mendoza","Letter A","First name"],a:1,skill:"Filing Rules",tech:"For names written last name first, file by surname. The surname is Mendoza."},
 {cat:"Clerical Ability",q:"If office hours are 8:00 AM to 5:00 PM with 1 hour lunch break, how many working hours are there?",choices:["7 hours","8 hours","9 hours","10 hours"],a:1,skill:"Clerical Computation",tech:"8 AM to 5 PM is 9 hours. Subtract 1 hour lunch break = 8 working hours."},
 {cat:"General Information",q:"Which value is emphasized by arriving on time and completing duties promptly?",choices:["Punctuality","Secrecy","Favoritism","Extravagance"],a:0,skill:"Work Values",tech:"Arriving on time and prompt work point to punctuality."}
];
let generatedQuestions = [];
function answerChoice(correct,wrongChoices){
 const choices=[correct,...wrongChoices].map(String);
 return {choices,a:0};
}
function addGeneratedQuestion(list,cat,q,correct,wrongChoices,skill,tech){
 const item=answerChoice(correct,wrongChoices);
 if(new Set(item.choices).size<4) return;
 list.push({cat,q,choices:item.choices,a:item.a,skill,tech});
}
function generateGeneratedQuestions(){
 const list=[];
 const vocabPairs=[
  ["abundant","plentiful","scarce","tiny","weak"],["accurate","correct","careless","late","ordinary"],["brief","short","lengthy","formal","difficult"],["cautious","careful","reckless","quick","silent"],["diligent","hardworking","lazy","confused","angry"],["essential","necessary","optional","rare","distant"],["fragile","breakable","strong","bright","simple"],["generous","giving","selfish","strict","fearful"],["hostile","unfriendly","helpful","calm","honest"],["impartial","fair","biased","slow","secret"],["legible","readable","hidden","verbal","complex"],["mandatory","required","optional","informal","private"],["obsolete","outdated","modern","active","legal"],["prudent","wise","careless","noisy","temporary"],["rapid","fast","slow","minor","formal"],["sufficient","enough","lacking","empty","late"],["transparent","open","secretive","heavy","ancient"],["urgent","immediate","delayed","minor","unclear"]
 ];
 for(let r=0;r<35;r++){
  vocabPairs.forEach(([word,correct,...wrong])=>{
   addGeneratedQuestion(list,"Verbal Ability","Choose the word closest in meaning to "+word.toUpperCase()+".",correct,wrong,"Vocabulary","Match the core meaning of the word, then eliminate choices with the opposite or unrelated meaning.");
   addGeneratedQuestion(list,"Verbal Ability","Choose the word opposite in meaning to "+word.toUpperCase()+".",wrong[0],[correct,wrong[1],wrong[2]],"Vocabulary","For antonyms, first define the word, then choose the clearest opposite.");
  });
 }
 const subjects=["The clerk","The officers","Neither the supervisor nor the assistants","Each applicant","The documents","The committee"];
 const verbs=[["is","are","were","have been"],["files","file","filing","filed"],["was","were","are","have"],["submits","submit","submitting","were"],["are","is","was","has"],["meets","meet","meeting","were"]];
 subjects.forEach((subject,i)=>{
  for(let r=0;r<120;r++) addGeneratedQuestion(list,"Verbal Ability",subject+" ___ required to follow office procedures.",verbs[i][0],verbs[i].slice(1),"Grammar","Check whether the subject is singular or plural, then choose the verb that agrees with it.");
 });
 const rcScenarios=[
  ["The office reduced paper use after forms were moved online.","What was the effect of moving forms online?","Paper use decreased",["Paper use increased","Forms were banned","Employees stopped reporting"]],
  ["Mina reviewed each instruction before answering because she wanted to avoid careless mistakes.","What can be inferred about Mina?","She was careful",["She ignored instructions","She was absent","She guessed quickly"]],
  ["The agency opened early service windows to help applicants who work during the day.","Why were early service windows opened?","To help working applicants",["To close offices early","To reduce services","To avoid applicants"]],
  ["The memo says employees must submit reports every Friday to keep records updated.","Why are reports submitted every Friday?","To keep records updated",["To delay records","To cancel reporting","To avoid supervisors"]]
 ];
 for(let r=0;r<180;r++) rcScenarios.forEach(([passage,q,correct,wrong])=>addGeneratedQuestion(list,"Verbal Ability","Reading Comprehension: "+passage+" "+q,correct,wrong,"Reading Comprehension","Use Q-R-A: read the question first, scan for the exact clue, then answer only from stated or clearly implied information."));
 for(let base=60;base<=990;base+=10){
  [5,10,15,20,25,30,40,50].forEach(percent=>{
   const correct=base*percent/100;
   addGeneratedQuestion(list,"Numerical Ability",percent+"% of "+base+" is:",correct,[correct+5,Math.max(0,correct-5),correct+10],"Percentage","Convert the percent to a fraction or decimal, then multiply by the base number.");
  });
 }
 for(let price=200;price<=5000;price+=100){
  [5,10,15,20,25,30].forEach(discount=>{
   const correct=price-(price*discount/100);
   addGeneratedQuestion(list,"Numerical Ability","A ₱"+price+" item is discounted by "+discount+"%. What is the sale price?","₱"+correct,["₱"+(correct+50),"₱"+(Math.max(0,correct-50)),"₱"+(price+discount)],"Percentage","Find the discount amount first, then subtract it from the original price.");
  });
 }
 for(let a=2;a<=40;a++) for(let b=2;b<=12;b++){
  const total=a*b;
  addGeneratedQuestion(list,"Numerical Ability","If "+a+" items cost ₱"+total*5+", how much do "+b+" items cost at the same rate?","₱"+(b*5),["₱"+(a*5),"₱"+(total),"₱"+(b*10)],"Ratio and Proportion","Find the unit price first, then multiply by the required number of items.");
 }
 for(let start=1;start<=90;start++) for(let step=2;step<=12;step++){
  const seq=[start,start+step,start+step*2,start+step*3];
  addGeneratedQuestion(list,"Numerical Ability","Find the next number: "+seq.join(", ") + ", ___",start+step*4,[start+step*3,start+step*5,start+step*4+1],"Number Sequence","Look for the constant difference, then continue the pattern.");
 }
 const names=["Ana","Ben","Carlo","Dana","Elena","Felix","Gina","Hector","Iris","Jose","Kara","Leo"];
 for(let i=0;i<names.length-3;i++){
  const a=names[i],b=names[i+1],c=names[i+2],d=names[i+3];
  for(let r=0;r<80;r++) addGeneratedQuestion(list,"Analytical Ability",d+" is older than "+a+". "+a+" is older than "+b+". "+b+" is older than "+c+". Who is the oldest?",d,[a,b,c],"Ordering Logic","Write the relationships as a chain. The person at the far left is the oldest.");
 }
 const roles=["clerks","teachers","nurses","drivers","inspectors","cashiers","analysts","engineers"];
 roles.forEach(role=>{
  for(let r=0;r<140;r++) addGeneratedQuestion(list,"Analytical Ability","All "+role+" are employees. All employees follow office rules. Therefore:","All "+role+" follow office rules",["No "+role+" follow office rules","All employees are "+role,"Some office rules are employees"],"Syllogism","Follow the logic chain from the first group to the second group to the final condition.");
 });
 const patternLetters=["A","B","C","D","E","F","G","H","I","J","K","L","M"];
 for(let i=0;i<patternLetters.length-6;i++) for(let step=1;step<=3;step++){
  const seq=[0,1,2,3].map(n=>patternLetters[i+n*step]);
  const correct=patternLetters[i+4*step];
  if(correct) addGeneratedQuestion(list,"Analytical Ability","Complete the pattern: "+seq.join(", ") + ", ___",correct,[patternLetters[i+4*step-1],patternLetters[i+4*step+1]||"Z",patternLetters[i]],"Pattern Recognition","Identify how many letters are skipped each time, then continue the same movement.");
 }
 const laws=[
  ["RA 6713","ethical standards for public officials and employees"],["Data Privacy Act","protection of personal information"],["Bill of Rights","basic rights and protections of citizens"],["Ombudsman","investigation of complaints against public officials"],["1987 Constitution","highest law of the Philippines"],["Public office","a public trust"],["Judicial branch","interprets laws"],["Legislative branch","makes laws"],["Executive branch","enforces laws"]
 ];
 for(let r=0;r<150;r++) laws.forEach(([term,correct])=>addGeneratedQuestion(list,"General Information",term+" is mainly about:",correct,["private business profit","personal campaign promotion","sports tournament rules"],"General Information","Connect the term to its public service meaning and eliminate unrelated choices."));
 const surnames=["Santos","Reyes","Rivera","Ramos","Dela Cruz","Delos Santos","Mendoza","Garcia","Aquino","Bautista","Cruz","Domingo","Flores","Lopez","Navarro","Villanueva"];
 for(let i=0;i<surnames.length-3;i++){
  const group=[surnames[i],surnames[i+1],surnames[i+2],surnames[i+3]];
  const sorted=[...group].sort((a,b)=>a.localeCompare(b));
  addGeneratedQuestion(list,"Clerical Ability","Arrange alphabetically: "+group.join(", ") + ".",sorted.join(", "),[[group[1],group[0],group[2],group[3]].join(", "),[group[3],group[2],group[1],group[0]].join(", "),[group[0],group[2],group[1],group[3]].join(", ")],"Alphabetical Filing","Compare surnames letter by letter. File names in A-to-Z order.");
 }
 for(let code=1000;code<=9999;code++){
  if(code%3!==0) continue;
  const text="CSC-"+code;
  addGeneratedQuestion(list,"Clerical Ability","Which pair is exactly the same?",text+" / "+text,[text+" / CSC-"+(code+1),"C5C-"+code+" / "+text,text+" / CSC-"+String(code).split("").reverse().join("")],"Checking and Comparing","Compare each letter and number from left to right. One changed character makes the pair incorrect.");
 }
 return shuffleList(list);
}
function getAllQuestions(){
 if(!generatedQuestions.length) generatedQuestions=generateGeneratedQuestions();
 return [...questions,...generatedQuestions];
}
function shuffleList(items){
 const shuffled=[...items];
 for(let i=shuffled.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
 }
 return shuffled;
}
function randomizeQuestion(q){
  const choices=shuffleList(q.choices.map((text,index)=>({text,index})));
  return {
   ...q,
   choices:choices.map(choice=>choice.text),
   a:choices.findIndex(choice=>choice.index===q.a)
  };
}
function getExamCoverage(){
 return examCoverage[selectedLevel] || examCoverage.Professional;
}
function getLevelQuestionPool(){
 const allowedCategories=getExamCoverage().categories.map(category=>category.name);
 return getAllQuestions().filter(q=>allowedCategories.includes(q.cat));
}
function takeCategoryQuestions(categoryName,count){
 const pool=getAllQuestions().filter(q=>q.cat===categoryName);
 const picked=[];
 if(!pool.length) return picked;
 while(picked.length<count){
  picked.push(...shuffleList(pool));
 }
 return picked.slice(0,count);
}
function buildQuestionsFromPlan(plan){
 const plannedQuestions=plan.flatMap(section=>takeCategoryQuestions(section.name,section.count));
 return shuffleList(plannedQuestions).map(randomizeQuestion);
}
function buildRandomizedQuestions(count=DIAGNOSTIC_QUESTION_COUNT){
 return shuffleList(getLevelQuestionPool()).slice(0,count).map(randomizeQuestion);
}
function buildDiagnosticQuestions(){
 return buildQuestionsFromPlan(getExamCoverage().diagnosticPlan);
}
function getMockItemCount(){
 return getExamCoverage().items;
}
function buildMockExam(){
 return buildQuestionsFromPlan(getExamCoverage().mockPlan);
}
function buildQuestionSet(filter){
 let pool=getLevelQuestionPool();
 if(filter==="mock") return buildMockExam();
 if(filter==="mixed") return buildRandomizedQuestions(8);
 if(filter){
  const levelPool=getLevelQuestionPool();
  const directMatches=levelPool.filter(q=>q.skill===filter || q.cat===filter);
  const directCategories=[...new Set(directMatches.map(q=>q.cat))];
  const relatedMatches=levelPool.filter(q=>directCategories.includes(q.cat) && !directMatches.includes(q));
  pool=[...directMatches,...relatedMatches];
 }
 if(!pool.length) pool=getLevelQuestionPool();
 return shuffleList(pool).slice(0,Math.min(8,pool.length)).map(randomizeQuestion);
}
function renderCoverageBlock(titleId,metaId,detailsId){
 const coverage=getExamCoverage();
 const title=document.getElementById(titleId);
 const meta=document.getElementById(metaId);
 const details=document.getElementById(detailsId);
 if(title) title.textContent=selectedLevel+" CSC coverage";
 if(meta) meta.textContent=coverage.items+" items • "+coverage.time;
 if(!details) return;
 details.innerHTML=coverage.categories.map(category=>{
  const mockCount=coverage.mockPlan.find(item=>item.name===category.name)?.count || 0;
  const diagnosticCount=coverage.diagnosticPlan.find(item=>item.name===category.name)?.count || 0;
  const topics=category.topics.map(topic=>`<li>${topic}</li>`).join("");
  return `<div class="coverage-card"><small>${diagnosticCount} diagnostic • ${mockCount} mock items</small><h4>${category.name}</h4><ul>${topics}</ul></div>`;
 }).join("");
}
function renderCoverageDetails(){
 renderCoverageBlock('coverageTitle','coverageMeta','coverageDetails');
 renderCoverageBlock('memberCoverageTitle','memberCoverageMeta','memberCoverageDetails');
 const mockMeta=document.getElementById('mockExamMeta');
 if(mockMeta) mockMeta.textContent=selectedLevel+" • "+getExamCoverage().items+" items • "+getExamCoverage().time;
 const abilityTitle=document.getElementById('levelAbilityTitle');
 const abilityMeta=document.getElementById('levelAbilityMeta');
 const abilityIcon=document.getElementById('levelAbilityIcon');
 const isSub=selectedLevel==="Subprofessional";
 if(abilityTitle) abilityTitle.textContent=isSub?"Clerical Ability Drill":"Analytical Reasoning Drill";
 if(abilityMeta) abilityMeta.textContent=isSub?"Filing, coding, spelling, checking":"Logic, syllogism, ordering";
 if(abilityIcon) abilityIcon.textContent=isSub?"CL":"∴";
}
function startLevelAbilityDrill(){
 startDrill(selectedLevel==="Subprofessional"?"Clerical Ability":"Analytical Ability");
}
function showScreen(id){
 document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 window.scrollTo({top:0,behavior:'smooth'});
}
function selectLevel(level){
 selectedLevel=level;
 localStorage.setItem("passCscSelectedLevel",level);
 document.getElementById('diagTitle').textContent=level+' Level Diagnostic';
 document.getElementById('testLevel').textContent=level+' Level';
 renderCoverageDetails();
 showScreen('diagnosticIntro');
}
function startTest(){
 activeMode=selectedLevel+" Diagnostic";
 document.getElementById('testLevel').textContent=selectedLevel+' Level';
 current=0;answers={};activeQuestions=buildDiagnosticQuestions();renderQuestion();showScreen('test');
}
function startDrill(filter){
 activeMode=filter==="mock"?selectedLevel+" CSC Mock Exam ("+getMockItemCount()+" items)":filter==="mixed"?"Mixed Skill Drill":filter+" Drill";
 document.getElementById('testLevel').textContent=activeMode;
 current=0;answers={};activeQuestions=buildQuestionSet(filter);renderQuestion();showScreen('test');
 showToast(activeMode+" started. Questions and choices are randomized.");
}
function startRecommendedReview(){
 startDrill(lastWeakSkill);
}
function renderQuestion(){
 const item=activeQuestions[current];
 document.getElementById('questionText').textContent=item.q;
 document.getElementById('categoryChip').textContent=item.cat;
 document.getElementById('qNumber').textContent=activeMode+' • Question '+(current+1);
 document.getElementById('progressText').textContent=(current+1)+' / '+activeQuestions.length;
 document.getElementById('progressFill').style.width=((current+1)/activeQuestions.length*100)+'%';
 const choices=document.getElementById('choices');choices.innerHTML='';
 item.choices.forEach((c,i)=>{
  const b=document.createElement('button');b.className='choice'+(answers[current]===i?' selected':'');
  b.innerHTML=`<span class="choice-letter">${String.fromCharCode(65+i)}</span><span>${c}</span>`;
  b.onclick=()=>{answers[current]=i;renderQuestion()};choices.appendChild(b);
 });
 document.getElementById('prevBtn').style.visibility=current===0?'hidden':'visible';
 document.getElementById('nextBtn').textContent=current===activeQuestions.length-1?(activeMode.includes('CSC Mock Exam')?'Submit Mock Exam':'Submit Diagnostic'):'Next';
 renderPills();
}
function renderPills(){
 const el=document.getElementById('qPills');el.innerHTML='';
 activeQuestions.forEach((_,i)=>{
  let cls='q-pill';if(i===current)cls+=' current';else if(answers[i]!==undefined)cls+=' done';
  const d=document.createElement('div');d.className=cls;d.textContent=i+1;d.onclick=()=>{current=i;renderQuestion()};el.appendChild(d);
 });
}
function nextQuestion(){
 if(current<activeQuestions.length-1){current++;renderQuestion()}else submitTest();
}
function prevQuestion(){if(current>0){current--;renderQuestion()}}
function submitTest(){
 const cats={};
 let correct=0;
 activeQuestions.forEach((q,i)=>{
  if(!cats[q.cat])cats[q.cat]={ok:0,total:0,skills:{}};
  cats[q.cat].total++;
  if(!cats[q.cat].skills[q.skill])cats[q.cat].skills[q.skill]={ok:0,total:0};
  cats[q.cat].skills[q.skill].total++;
  if(answers[i]===q.a){correct++;cats[q.cat].ok++;cats[q.cat].skills[q.skill].ok++}
 });
 const score=Math.round(correct/activeQuestions.length*100);
 document.getElementById('overallScore').textContent=score+'%';
 const banner=document.getElementById('statusBanner');
 const isMember=Boolean(localStorage.getItem('passCscCurrentUser'));
 const subscribePanel=document.getElementById('subscribePanel');
 if(subscribePanel) subscribePanel.style.display=isMember?'none':'grid';
 banner.className='status-banner '+(score>=80?'status-good':'status-warn');
 banner.textContent=score>=80?'You reached the 80% passing target. Aim for 85%+ consistently before exam day.':'You are not yet at the 80% target. Your personalized review below focuses on the skills costing you the most points.';
 const bars=document.getElementById('categoryBars');bars.innerHTML='';
 Object.entries(cats).forEach(([name,d])=>{
   const pct=Math.round(d.ok/d.total*100);
   bars.innerHTML+=`<div class="bar-row"><div class="bar-meta"><span>${name}</span><b>${pct}%</b></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></div>`;
 });
 let skills=[];
 Object.entries(cats).forEach(([cat,d])=>Object.entries(d.skills).forEach(([skill,s])=>skills.push({cat,skill,pct:Math.round(s.ok/s.total*100)})));
 skills.sort((a,b)=>a.pct-b.pct);
 const pr=document.getElementById('priorityList');pr.innerHTML='';
 skills.slice(0,3).forEach((s,i)=>pr.innerHTML+=`<div class="priority-item"><div class="priority-rank">${i+1}</div><div><b>${s.skill}</b><span>${s.cat} • ${s.pct}% mastery</span></div></div>`);
 lastWeakSkill=skills[0]?.skill || 'Percentage';
 document.getElementById('roadWeak').textContent=lastWeakSkill;
 const rev=document.getElementById('answerReview');rev.innerHTML='';
 activeQuestions.forEach((q,i)=>{
   const user=answers[i];
   const ok=user===q.a;
   rev.innerHTML+=`<div class="review-item">
    <div class="review-q">${i+1}. ${q.q}</div>
    <div class="review-grid">
      <div class="review-box"><small>Your result</small><p class="${ok?'correct':'wrong'}">${ok?'✓ Correct':'✕ '+(user===undefined?'No answer':'Your answer: '+String.fromCharCode(65+user))} • Correct: ${String.fromCharCode(65+q.a)} — ${q.choices[q.a]}</p></div>
      <div class="review-box tech"><small>Fastest technique</small><p>${q.tech}</p></div>
    </div>
   </div>`;
 });
 showScreen('results');
}
function showCheckout(){
 const modal=document.getElementById('paymentModal');
 modal.classList.add('show');
 modal.setAttribute('aria-hidden','false');
 document.getElementById('paymentEmail').focus();
}
function closeCheckout(){
 const modal=document.getElementById('paymentModal');
 modal.classList.remove('show');
 modal.setAttribute('aria-hidden','true');
}
function submitPayment(event){
 event.preventDefault();
 const email=document.getElementById('paymentEmail').value.trim().toLowerCase();
 const reference=document.getElementById('referenceNumber').value.trim();
 const proof=document.getElementById('paymentProof').files[0];
 if(!email || !reference || !proof){
  showToast("Gmail, reference number, and payment proof are required.");
  return;
 }
 if(!email.endsWith("@gmail.com")){
  showToast("Please use a valid Gmail address for account access.");
  return;
 }
 const payments=getPayments();
 const existing=payments.find(payment=>payment.email===email);
 if(existing){
  showToast("This email has been registered. Login here or use a different email.");
  closeCheckout();
  showLogin(email);
  return;
 }
 const payment={
  id:createFollowUpReference(),
  email,
  gcashReference:reference,
  proofName:proof.name,
  status:"pending",
  submittedAt:new Date().toLocaleString()
 };
 payments.unshift(payment);
 savePayments(payments);
 lastSubmittedPayment=payment;
 closeCheckout();
 document.getElementById('paymentEmail').value="";
 document.getElementById('referenceNumber').value="";
 document.getElementById('paymentProof').value="";
 document.getElementById('followUpReference').textContent=payment.id;
 showScreen('paymentStatus');
 showToast("Payment submitted. Save your follow-up reference number.");
}
function getPayments(){
 return JSON.parse(localStorage.getItem(PAYMENT_STORE_KEY) || "[]");
}
function savePayments(payments){
 localStorage.setItem(PAYMENT_STORE_KEY,JSON.stringify(payments));
}
function createFollowUpReference(){
 return "PSC-"+Date.now().toString().slice(-6)+"-"+Math.random().toString(36).slice(2,6).toUpperCase();
}
function showLogin(email=""){
 showScreen('login');
 document.getElementById('loginEmail').value=email;
 document.getElementById('loginEmail').focus();
}
function loginWithEmail(event){
 event.preventDefault();
 const email=document.getElementById('loginEmail').value.trim().toLowerCase();
 const payment=getPayments().find(item=>item.email===email);
 if(!payment){
  showToast("No registered payment found. Subscribe first or use a different email.");
  return;
 }
 if(payment.status!=="approved"){
  showToast("Payment is not approved yet. Follow up with support using reference "+payment.id+".");
  return;
 }
 localStorage.setItem("passCscCurrentUser",email);
 showLearnerDashboard();
}
function showLearnerDashboard(){
 const email=localStorage.getItem("passCscCurrentUser");
 if(!email){
  showLogin();
  showToast("Please login with your approved Gmail first.");
  return;
 }
 const greeting=document.getElementById('dashboardGreeting');
 if(greeting) greeting.textContent="Welcome back, "+email;
 const weak=document.getElementById('memberWeakSkill');
 if(weak) weak.textContent=lastWeakSkill || "Mixed";
 renderCoverageDetails();
 showScreen('dashboard');
}
function logoutLearner(){
 localStorage.removeItem("passCscCurrentUser");
 showScreen('home');
 showToast("Logged out.");
}
function initCustomerPage(){
 if(!document.getElementById('dashboard')) return;
 document.getElementById('diagTitle').textContent=selectedLevel+' Level Diagnostic';
 document.getElementById('testLevel').textContent=selectedLevel+' Level';
 renderCoverageDetails();
 if(localStorage.getItem("passCscCurrentUser")) showLearnerDashboard();
}
function openAdmin(){
 window.location.href="admin.html";
}
function loginAdmin(event){
 event.preventDefault();
 const password=document.getElementById('adminPassword').value;
 if(password!==ADMIN_PASSWORD){
  showToast("Invalid admin password.");
  return;
 }
 sessionStorage.setItem("passCscAdmin","true");
 document.getElementById('adminLoginPanel').style.display="none";
 document.getElementById('adminDashboardPanel').style.display="block";
 renderAdmin();
}
function logoutAdmin(){
 sessionStorage.removeItem("passCscAdmin");
 document.getElementById('adminLoginPanel').style.display="block";
 document.getElementById('adminDashboardPanel').style.display="none";
 document.getElementById('adminPassword').value="";
}
function initAdminPage(){
 if(!document.getElementById('adminLoginPanel')) return;
 const isAdmin=sessionStorage.getItem("passCscAdmin")==="true";
 document.getElementById('adminLoginPanel').style.display=isAdmin?"none":"block";
 document.getElementById('adminDashboardPanel').style.display=isAdmin?"block":"none";
 if(isAdmin) renderAdmin();
}
function renderAdmin(){
 const payments=getPayments();
 const pending=payments.filter(payment=>payment.status==="pending");
 document.getElementById('adminCount').textContent=pending.length+" pending";
 const container=document.getElementById('adminPayments');
 if(!payments.length){
  container.innerHTML='<div class="empty-state">No payment submissions yet.</div>';
  return;
 }
 container.innerHTML=payments.map(payment=>`<div class="admin-row">
  <div>
   <b>${payment.email}</b>
   <span>${payment.status.toUpperCase()} • Follow-up: ${payment.id}</span>
   <small>GCash ref: ${payment.gcashReference} • Proof: ${payment.proofName} • ${payment.submittedAt}</small>
  </div>
  <button class="btn ${payment.status==="approved"?"btn-secondary":"btn-primary"} small" onclick="approvePayment('${payment.id}')" ${payment.status==="approved"?"disabled":""}>${payment.status==="approved"?"Approved":"Approve"}</button>
 </div>`).join("");
}
function approvePayment(id){
 const payments=getPayments();
 const payment=payments.find(item=>item.id===id);
 if(!payment) return;
 payment.status="approved";
 payment.approvedAt=new Date().toLocaleString();
 savePayments(payments);
 renderAdmin();
 showToast("Approved. Learner can now login with Gmail and open the dashboard.");
}
function copySupportMessage(){
 const payment=lastSubmittedPayment;
 if(!payment){
  showToast("No recent payment reference found.");
  return;
 }
 const message=`Hello Pass CSC Support, please follow up my payment. Follow-up reference: ${payment.id}. Gmail: ${payment.email}. GCash reference: ${payment.gcashReference}.`;
 navigator.clipboard?.writeText(message);
 showToast("Support message copied.");
}
function showToast(message){
 const toast=document.getElementById('toast');
 toast.textContent=message;
 toast.classList.add('show');
 clearTimeout(showToast.timer);
 showToast.timer=setTimeout(()=>toast.classList.remove('show'),3200);
}
document.addEventListener('DOMContentLoaded',initAdminPage);
document.addEventListener('DOMContentLoaded',initCustomerPage);











