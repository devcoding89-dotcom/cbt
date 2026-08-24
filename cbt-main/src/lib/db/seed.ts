import type { Difficulty, Exam, Question, TextbookChapter } from "@/lib/types";

type QTuple = [
  Exam,
  string, // subject
  string, // topic
  string, // question
  string[], // options
  string, // answer letter
  string, // explanation
  Difficulty,
  number, // year
];

/**
 * Starter question bank.
 * These are sample/demo questions so the platform is usable out of the box —
 * replace or extend them from Admin → Questions → Import.
 */
const Q: QTuple[] = [
  // ---------------- JAMB Mathematics ----------------
  ["JAMB","Mathematics","Quadratic Equations","Solve for x: x² − 5x + 6 = 0",["x = 2 or 3","x = −2 or −3","x = 1 or 6","x = −1 or −6"],"A","Factorise: (x − 2)(x − 3) = 0 ⇒ x = 2 or x = 3.","easy",2023],
  ["JAMB","Mathematics","Quadratic Equations","If the roots of 2x² + kx + 8 = 0 are equal, find k.",["±4","±8","±16","±2"],"B","Equal roots ⇒ discriminant = 0: k² − 4(2)(8) = 0 ⇒ k² = 64 ⇒ k = ±8.","medium",2021],
  ["JAMB","Mathematics","Quadratic Equations","Find the sum of the roots of 3x² − 12x + 7 = 0.",["4","−4","7/3","12"],"A","Sum of roots = −b/a = 12/3 = 4.","easy",2019],
  ["JAMB","Mathematics","Indices and Logarithms","Simplify: log₁₀ 8 + log₁₀ 5 − log₁₀ 4",["1","2","10","0.5"],"A","log(8×5/4) = log 10 = 1.","easy",2020],
  ["JAMB","Mathematics","Indices and Logarithms","If 2^(x+1) = 32, find x.",["3","4","5","6"],"B","32 = 2⁵ ⇒ x + 1 = 5 ⇒ x = 4.","easy",2022],
  ["JAMB","Mathematics","Trigonometry","Evaluate sin 30° + cos 60°",["0.5","1","1.5","0"],"B","sin 30° = 0.5, cos 60° = 0.5 ⇒ sum = 1.","easy",2018],
  ["JAMB","Mathematics","Trigonometry","A ladder 10 m long leans against a wall making 60° with the ground. How high up the wall does it reach?",["5 m","8.66 m","10 m","7.07 m"],"B","Height = 10 sin 60° = 10(0.866) = 8.66 m.","medium",2021],
  ["JAMB","Mathematics","Calculus","Differentiate y = 3x³ − 5x with respect to x.",["9x² − 5","3x² − 5","9x³ − 5x","6x − 5"],"A","dy/dx = 9x² − 5.","easy",2022],
  ["JAMB","Mathematics","Calculus","Evaluate ∫(2x + 3) dx",["x² + 3x + c","2x² + 3x + c","x² + 3 + c","2x + c"],"A","∫2x dx = x², ∫3 dx = 3x ⇒ x² + 3x + c.","easy",2020],
  ["JAMB","Mathematics","Statistics","The mean of 5, 8, 11, x and 12 is 9. Find x.",["7","9","10","6"],"B","Sum = 45 ⇒ 36 + x = 45 ⇒ x = 9.","easy",2019],
  ["JAMB","Mathematics","Statistics","Find the median of: 3, 7, 2, 9, 4",["4","7","3","9"],"A","Ordered: 2,3,4,7,9 ⇒ median = 4.","easy",2021],
  ["JAMB","Mathematics","Probability","A fair die is thrown once. What is the probability of obtaining a prime number?",["1/2","1/3","2/3","1/6"],"A","Primes on a die: 2, 3, 5 ⇒ 3/6 = 1/2.","medium",2022],
  ["JAMB","Mathematics","Number Bases","Convert 25₁₀ to base 2.",["11001","10011","11010","10101"],"A","25 = 16 + 8 + 1 = 11001₂.","medium",2018],
  ["JAMB","Mathematics","Geometry","The interior angle of a regular polygon is 150°. How many sides has it?",["10","12","8","15"],"B","Exterior = 30° ⇒ n = 360/30 = 12.","medium",2020],
  ["JAMB","Mathematics","Sequences and Series","Find the 10th term of the AP: 3, 7, 11, …",["39","43","36","40"],"A","a = 3, d = 4 ⇒ T₁₀ = 3 + 9(4) = 39.","easy",2023],

  // ---------------- JAMB Physics ----------------
  ["JAMB","Physics","Projectile Motion","A body is projected with velocity 20 m/s at 30° to the horizontal. Find its time of flight. (g = 10 m/s²)",["1 s","2 s","4 s","0.5 s"],"B","T = 2u sinθ/g = 2(20)(0.5)/10 = 2 s.","medium",2021],
  ["JAMB","Physics","Projectile Motion","The maximum height reached by a projectile fired at 40 m/s vertically upward is (g = 10 m/s²)",["40 m","80 m","160 m","20 m"],"B","H = u²/2g = 1600/20 = 80 m.","medium",2019],
  ["JAMB","Physics","Newton's Laws","A force of 20 N acts on a 4 kg mass. Its acceleration is",["5 m/s²","80 m/s²","0.2 m/s²","24 m/s²"],"A","a = F/m = 20/4 = 5 m/s².","easy",2022],
  ["JAMB","Physics","Newton's Laws","The law of inertia is also known as",["Newton's first law","Newton's second law","Newton's third law","Hooke's law"],"A","Newton's first law states a body remains at rest or in uniform motion unless acted upon by an external force.","easy",2018],
  ["JAMB","Physics","Electricity","Three 6 Ω resistors are connected in parallel. The effective resistance is",["18 Ω","2 Ω","6 Ω","0.5 Ω"],"B","1/R = 3/6 ⇒ R = 2 Ω.","medium",2020],
  ["JAMB","Physics","Electricity","The unit of electrical resistance is",["Volt","Ampere","Ohm","Watt"],"C","Resistance is measured in ohms (Ω).","easy",2017],
  ["JAMB","Physics","Waves","A wave of frequency 50 Hz has a wavelength of 4 m. Its speed is",["200 m/s","12.5 m/s","54 m/s","0.08 m/s"],"A","v = fλ = 50 × 4 = 200 m/s.","easy",2021],
  ["JAMB","Physics","Waves","Sound cannot travel through",["Solids","Liquids","Gases","Vacuum"],"D","Sound is a mechanical wave and requires a material medium.","easy",2019],
  ["JAMB","Physics","Heat Energy","The quantity of heat required to raise the temperature of 2 kg of water by 10 °C is (c = 4200 J/kg·K)",["8400 J","84000 J","42000 J","21000 J"],"B","Q = mcΔθ = 2 × 4200 × 10 = 84,000 J.","medium",2022],
  ["JAMB","Physics","Optics","An object placed 10 cm from a concave mirror of focal length 5 cm forms an image at",["10 cm, real","5 cm, virtual","infinity","20 cm, virtual"],"A","1/v = 1/f − 1/u = 1/5 − 1/10 = 1/10 ⇒ v = 10 cm (real, inverted, same size).","hard",2020],

  // ---------------- JAMB Chemistry ----------------
  ["JAMB","Chemistry","Atomic Structure","The number of neutrons in ³⁵₁₇Cl is",["17","18","35","52"],"B","Neutrons = mass number − atomic number = 35 − 17 = 18.","easy",2021],
  ["JAMB","Chemistry","Atomic Structure","Isotopes of an element differ in the number of",["Protons","Electrons","Neutrons","Energy levels"],"C","Isotopes have the same protons but different neutrons.","easy",2018],
  ["JAMB","Chemistry","Organic Chemistry","The general formula of alkanes is",["CnH2n","CnH2n+2","CnH2n−2","CnHn"],"B","Alkanes are saturated hydrocarbons with formula CnH2n+2.","easy",2022],
  ["JAMB","Chemistry","Organic Chemistry","Which of these is an unsaturated hydrocarbon?",["Ethane","Propane","Ethene","Methane"],"C","Ethene (C₂H₄) contains a carbon–carbon double bond.","easy",2020],
  ["JAMB","Chemistry","Organic Chemistry","The IUPAC name of CH₃CH₂OH is",["Methanol","Ethanol","Ethanal","Ethanoic acid"],"B","Two carbons with an –OH group ⇒ ethanol.","easy",2019],
  ["JAMB","Chemistry","Acids Bases and Salts","A solution with pH 3 is",["Strongly basic","Weakly basic","Acidic","Neutral"],"C","pH below 7 indicates an acidic solution.","easy",2021],
  ["JAMB","Chemistry","Mole Concept","How many moles are in 44 g of CO₂? (C = 12, O = 16)",["0.5","1","2","4"],"B","Molar mass of CO₂ = 44 g/mol ⇒ 44/44 = 1 mole.","easy",2022],
  ["JAMB","Chemistry","Mole Concept","The volume occupied by 0.5 mole of a gas at s.t.p. is",["11.2 dm³","22.4 dm³","5.6 dm³","44.8 dm³"],"A","1 mole occupies 22.4 dm³ ⇒ 0.5 × 22.4 = 11.2 dm³.","medium",2020],
  ["JAMB","Chemistry","Electrolysis","During the electrolysis of acidified water, the gas liberated at the anode is",["Hydrogen","Oxygen","Chlorine","Nitrogen"],"B","Oxidation of water at the anode liberates oxygen.","medium",2018],
  ["JAMB","Chemistry","Periodic Table","Elements in the same group of the periodic table have the same",["Atomic mass","Number of valence electrons","Number of neutrons","Atomic number"],"B","Group members share the same number of valence electrons.","easy",2021],

  // ---------------- JAMB Biology ----------------
  ["JAMB","Biology","Cell Biology","The powerhouse of the cell is the",["Ribosome","Mitochondrion","Nucleus","Golgi body"],"B","Mitochondria produce ATP through cellular respiration.","easy",2020],
  ["JAMB","Biology","Cell Biology","Which structure is present in plant cells but absent in animal cells?",["Cell membrane","Cell wall","Nucleus","Cytoplasm"],"B","Plant cells have a cellulose cell wall.","easy",2019],
  ["JAMB","Biology","Genetics","A cross between two heterozygous tall pea plants (Tt × Tt) gives a phenotypic ratio of",["1:1","3:1","9:3:3:1","1:2:1"],"B","Monohybrid cross ⇒ 3 tall : 1 short.","medium",2021],
  ["JAMB","Biology","Genetics","The sex chromosomes of a normal human male are",["XX","XY","YY","XO"],"B","Human males are XY.","easy",2018],
  ["JAMB","Biology","Ecology","Organisms that manufacture their own food are called",["Consumers","Producers","Decomposers","Parasites"],"B","Producers (autotrophs) synthesise food via photosynthesis.","easy",2022],
  ["JAMB","Biology","Nutrition","The end product of carbohydrate digestion is",["Amino acids","Glucose","Fatty acids","Glycerol"],"B","Carbohydrates are broken down to simple sugars, mainly glucose.","easy",2020],
  ["JAMB","Biology","Circulatory System","The blood vessel that carries oxygenated blood from the lungs to the heart is the",["Pulmonary artery","Pulmonary vein","Aorta","Vena cava"],"B","The pulmonary vein returns oxygenated blood to the left atrium.","medium",2021],

  // ---------------- JAMB Use of English ----------------
  ["JAMB","Use of English","Synonyms","Choose the word nearest in meaning to ABUNDANT: The harvest was abundant this year.",["Scarce","Plentiful","Late","Poor"],"B","Abundant means existing in large quantities — plentiful.","easy",2021],
  ["JAMB","Use of English","Antonyms","Choose the option opposite in meaning to CANDID.",["Frank","Honest","Evasive","Open"],"C","Candid means frank/open; its opposite is evasive.","medium",2020],
  ["JAMB","Use of English","Lexis and Structure","Choose the correct option: Neither the teacher nor the students ___ present.",["was","were","is","has"],"B","With 'neither…nor', the verb agrees with the nearer subject 'students' ⇒ were.","medium",2022],
  ["JAMB","Use of English","Lexis and Structure","The meeting was postponed ___ the chairman's absence.",["because","due to","owing","in spite"],"B","'Due to' correctly introduces the noun phrase 'the chairman's absence'.","easy",2019],
  ["JAMB","Use of English","Idioms","'To bury the hatchet' means to",["Hide a weapon","Make peace","Dig a grave","Start a fight"],"B","The idiom means to end a quarrel and make peace.","easy",2018],
  ["JAMB","Use of English","Comprehension","In the sentence 'The boy who won the prize is my brother', the underlined clause 'who won the prize' functions as",["An adverbial clause","An adjectival clause","A noun clause","A prepositional phrase"],"B","It modifies the noun 'boy', so it is an adjectival (relative) clause.","medium",2021],
  ["JAMB","Use of English","Oral English","Choose the word with a different vowel sound from the others.",["beat","seat","great","meat"],"C","'Great' has /eɪ/ while the others have /iː/.","medium",2020],

  // ---------------- JAMB Economics / Government ----------------
  ["JAMB","Economics","Demand and Supply","The law of demand states that, other things being equal, as price rises quantity demanded",["Rises","Falls","Remains constant","Doubles"],"B","There is an inverse relationship between price and quantity demanded.","easy",2021],
  ["JAMB","Economics","Demand and Supply","A good whose demand rises as income falls is called",["A normal good","An inferior good","A giffen good","A luxury good"],"B","Inferior goods have negative income elasticity of demand.","medium",2019],
  ["JAMB","Economics","Money and Banking","The main function of the Central Bank of Nigeria is to",["Accept deposits from the public","Issue currency and regulate money supply","Give loans to traders","Sell shares"],"B","The CBN is the apex bank responsible for currency issue and monetary policy.","easy",2022],
  ["JAMB","Economics","National Income","GDP measures the total value of goods and services produced",["By citizens anywhere in the world","Within a country's borders in a period","By the government only","By private firms only"],"B","GDP is output produced within the geographical boundaries of a country.","medium",2020],
  ["JAMB","Government","Constitution","A constitution that is contained in a single document is described as",["Unwritten","Written","Flexible","Unitary"],"B","A written constitution is codified in one document.","easy",2021],
  ["JAMB","Government","Federalism","In a federal system, powers are",["Concentrated in the centre","Shared between central and component units","Held by traditional rulers","Held by the judiciary alone"],"B","Federalism divides powers between central and federating units.","easy",2020],
  ["JAMB","Government","Nigerian Government","Nigeria gained independence on",["1 October 1960","1 October 1963","29 May 1999","15 January 1966"],"A","Nigeria became independent on 1 October 1960.","easy",2018],

  // ---------------- WAEC ----------------
  ["WAEC","Mathematics","Simple Equations","Solve: 3(x − 2) = 12",["x = 4","x = 6","x = 2","x = 5"],"B","3x − 6 = 12 ⇒ 3x = 18 ⇒ x = 6.","easy",2022],
  ["WAEC","Mathematics","Mensuration","Find the area of a circle of radius 7 cm. (π = 22/7)",["154 cm²","44 cm²","49 cm²","22 cm²"],"A","A = πr² = 22/7 × 49 = 154 cm².","easy",2021],
  ["WAEC","Mathematics","Ratio and Proportion","Share ₦4,500 between A and B in the ratio 4:5. How much does B get?",["₦2,000","₦2,500","₦2,250","₦1,800"],"B","Total parts = 9 ⇒ B gets 5/9 × 4500 = ₦2,500.","easy",2020],
  ["WAEC","English Language","Concord","Choose the correct option: Each of the boys ___ a book.",["have","has","are having","were having"],"B","'Each' is singular and takes a singular verb.","easy",2021],
  ["WAEC","English Language","Vocabulary","Choose the word nearest in meaning to METICULOUS.",["Careless","Thorough","Rapid","Rude"],"B","Meticulous means showing great attention to detail — thorough.","medium",2022],
  ["WAEC","Physics","Density","A body of mass 500 g occupies a volume of 250 cm³. Its density is",["2 g/cm³","0.5 g/cm³","125 g/cm³","750 g/cm³"],"A","ρ = m/V = 500/250 = 2 g/cm³.","easy",2021],
  ["WAEC","Physics","Simple Machines","The velocity ratio of a machine with 4 pulleys is",["1","2","4","8"],"C","For a block-and-tackle system the velocity ratio equals the number of supporting ropes/pulleys = 4.","medium",2020],
  ["WAEC","Chemistry","Chemical Bonding","The bond formed by the transfer of electrons is",["Covalent","Ionic","Metallic","Hydrogen"],"B","Electron transfer forms oppositely charged ions held by ionic (electrovalent) bonds.","easy",2021],
  ["WAEC","Biology","Respiration","The end products of aerobic respiration are",["Alcohol and CO₂","CO₂ and water","Lactic acid only","Oxygen and glucose"],"B","Aerobic respiration yields carbon dioxide, water and energy.","easy",2022],
  ["WAEC","Economics","Factors of Production","The reward for land as a factor of production is",["Wages","Rent","Interest","Profit"],"B","Land earns rent; labour earns wages; capital earns interest; entrepreneurship earns profit.","easy",2021],

  // ---------------- NECO ----------------
  ["NECO","Mathematics","Percentages","A trader bought an item for ₦800 and sold it for ₦1,000. Find the percentage profit.",["20%","25%","30%","15%"],"B","Profit = ₦200 ⇒ 200/800 × 100 = 25%.","easy",2022],
  ["NECO","Mathematics","Geometry","The sum of the interior angles of a hexagon is",["540°","720°","900°","360°"],"B","(n − 2) × 180° = 4 × 180° = 720°.","easy",2021],
  ["NECO","English Language","Punctuation","Which sentence is correctly punctuated?",["My brother, who lives in Kano is a doctor.","My brother who lives in Kano, is a doctor.","My brother, who lives in Kano, is a doctor.","My brother who lives in Kano is, a doctor."],"C","Non-defining relative clauses are enclosed by a pair of commas.","medium",2022],
  ["NECO","Biology","Excretion","The main excretory organ in mammals is the",["Liver","Kidney","Lung","Skin"],"B","Kidneys remove nitrogenous waste as urine.","easy",2021],
  ["NECO","Chemistry","Water Treatment","Temporary hardness of water is caused by",["Calcium sulphate","Calcium hydrogen trioxocarbonate(IV)","Sodium chloride","Magnesium sulphate"],"B","Temporary hardness is due to dissolved hydrogen trioxocarbonates(IV) of calcium and magnesium, removed by boiling.","medium",2020],
  ["NECO","Physics","Magnetism","Like poles of a magnet",["Attract each other","Repel each other","Have no effect","Fuse together"],"B","Like poles repel; unlike poles attract.","easy",2021],
  ["NECO","Government","Democracy","The phrase 'government of the people, by the people and for the people' was coined by",["Aristotle","Abraham Lincoln","Karl Marx","John Locke"],"B","Abraham Lincoln, in the Gettysburg Address (1863).","easy",2019],
];

export function seedQuestions(): Omit<Question, "id" | "created_at">[] {
  return Q.map(([exam, subject, topic, question_text, options, correct_answer, explanation, difficulty, year]) => ({
    exam,
    subject,
    topic,
    question_text,
    options,
    correct_answer,
    explanation,
    difficulty,
    year,
    image_url: null,
    is_active: true,
  }));
}

const chapter = (
  exam: Exam,
  subject: string,
  book_title: string,
  chapter_number: number,
  title: string,
  topic_tags: string[],
  description: string,
  body: string,
): Omit<TextbookChapter, "id" | "created_at"> => ({
  exam,
  subject,
  book_title,
  title,
  chapter_number,
  description,
  topic_tags,
  content_html: body,
  file_path: null,
  page_count: null,
  is_published: true,
});

export function seedTextbooks(): Omit<TextbookChapter, "id" | "created_at">[] {
  return [
    chapter("JAMB","Mathematics","New School Mathematics for Senior Secondary",2,"Quadratic Equations",["Quadratic Equations","Algebra","Sequences and Series"],"Factorisation, completing the square, the quadratic formula and word problems.",`
<h2>2.1 What is a quadratic equation?</h2>
<p>A <strong>quadratic equation</strong> is any equation that can be written in the standard form</p>
<p class="eq">ax² + bx + c = 0,&nbsp; a ≠ 0</p>
<p>where <em>a</em>, <em>b</em> and <em>c</em> are constants. The highest power of the unknown is 2, which is why every quadratic equation has (at most) two roots.</p>
<h2>2.2 Method 1 — Factorisation</h2>
<p>Look for two numbers whose <strong>product is ac</strong> and whose <strong>sum is b</strong>.</p>
<div class="example"><p><strong>Example.</strong> Solve x² − 5x + 6 = 0.</p>
<p>ac = 6 and b = −5. The numbers −2 and −3 work. So</p>
<p class="eq">x² − 2x − 3x + 6 = 0 ⇒ x(x − 2) − 3(x − 2) = 0 ⇒ (x − 2)(x − 3) = 0</p>
<p>Therefore x = 2 or x = 3.</p></div>
<h2>2.3 Method 2 — Completing the square</h2>
<p>Rewrite ax² + bx + c = 0 as (x + b/2a)² = (b² − 4ac)/4a². This is useful when factors are not obvious and is the method used to derive the formula.</p>
<h2>2.4 Method 3 — The quadratic formula</h2>
<p class="eq">x = [−b ± √(b² − 4ac)] / 2a</p>
<p>The expression <strong>Δ = b² − 4ac</strong> is called the <em>discriminant</em>:</p>
<ul>
<li>Δ &gt; 0 → two distinct real roots</li>
<li>Δ = 0 → two equal (repeated) roots</li>
<li>Δ &lt; 0 → no real roots (complex roots)</li>
</ul>
<h2>2.5 Sum and product of roots</h2>
<p>If α and β are the roots of ax² + bx + c = 0 then</p>
<p class="eq">α + β = −b/a &nbsp;&nbsp;&nbsp; αβ = c/a</p>
<p>An equation with roots α and β is x² − (α + β)x + αβ = 0.</p>
<h2>2.6 JAMB-style worked example</h2>
<div class="example"><p><strong>Q.</strong> If the roots of 2x² + kx + 8 = 0 are equal, find k.</p>
<p>Equal roots ⇒ Δ = 0 ⇒ k² − 4(2)(8) = 0 ⇒ k² = 64 ⇒ <strong>k = ±8</strong>.</p></div>
<h2>2.7 Exercise</h2>
<ol><li>Solve 3x² − 12x + 7 = 0 using the formula.</li><li>Find the equation whose roots are 4 and −3.</li><li>For what values of p does x² + px + 9 = 0 have equal roots?</li></ol>`),

    chapter("JAMB","Physics","Essential Physics for Senior Secondary",5,"Projectile Motion",["Projectile Motion","Newton's Laws","Motion"],"Horizontal and oblique projection, time of flight, range and maximum height.",`
<h2>5.1 Introduction</h2>
<p>A <strong>projectile</strong> is any body thrown into the air and allowed to move freely under gravity. Its motion is analysed by treating the horizontal and vertical components <em>independently</em>.</p>
<ul><li>Horizontal: constant velocity (no acceleration, ignoring air resistance)</li><li>Vertical: uniform acceleration <em>g</em> = 9.8 m/s² (often taken as 10 m/s²)</li></ul>
<h2>5.2 Key formulae (projection at angle θ with speed u)</h2>
<table><tr><th>Quantity</th><th>Formula</th></tr>
<tr><td>Time to maximum height</td><td>t = u sinθ / g</td></tr>
<tr><td>Time of flight</td><td>T = 2u sinθ / g</td></tr>
<tr><td>Maximum height</td><td>H = u² sin²θ / 2g</td></tr>
<tr><td>Range</td><td>R = u² sin 2θ / g</td></tr></table>
<p>The range is maximum when θ = 45°, since sin 2θ = 1.</p>
<h2>5.3 Worked example</h2>
<div class="example"><p><strong>Q.</strong> A body is projected at 20 m/s at 30° to the horizontal (g = 10 m/s²). Find the time of flight and range.</p>
<p>T = 2(20)(sin 30°)/10 = 2(20)(0.5)/10 = <strong>2 s</strong></p>
<p>R = (20² sin 60°)/10 = (400 × 0.866)/10 = <strong>34.6 m</strong></p></div>
<h2>5.4 Horizontal projection</h2>
<p>For a body projected horizontally from a height h: time of fall t = √(2h/g), and horizontal distance x = u t. The vertical and horizontal motions are still independent.</p>
<h2>5.5 Common exam traps</h2>
<ul><li>Forgetting to resolve u into components.</li><li>Using g = 10 in one line and 9.8 in another.</li><li>Confusing time to maximum height (t) with total time of flight (T = 2t).</li></ul>`),

    chapter("JAMB","Chemistry","Comprehensive Chemistry for SSS",7,"Organic Chemistry I — Hydrocarbons",["Organic Chemistry","Alkanes","Alkenes"],"Homologous series, nomenclature, isomerism and reactions of alkanes, alkenes and alkynes.",`
<h2>7.1 The homologous series</h2>
<p>Organic compounds are grouped into families called <strong>homologous series</strong>. Members of a series share a general formula, similar chemical properties and differ by a –CH₂– unit.</p>
<table><tr><th>Series</th><th>General formula</th><th>Example</th></tr>
<tr><td>Alkanes</td><td>CnH2n+2</td><td>Methane CH₄</td></tr>
<tr><td>Alkenes</td><td>CnH2n</td><td>Ethene C₂H₄</td></tr>
<tr><td>Alkynes</td><td>CnH2n−2</td><td>Ethyne C₂H₂</td></tr>
<tr><td>Alkanols</td><td>CnH2n+1OH</td><td>Ethanol C₂H₅OH</td></tr></table>
<h2>7.2 Alkanes</h2>
<p>Saturated hydrocarbons — only single C–C bonds. They are generally unreactive but undergo <em>substitution</em> with halogens in sunlight:</p>
<p class="eq">CH₄ + Cl₂ → CH₃Cl + HCl &nbsp;(UV light)</p>
<h2>7.3 Alkenes</h2>
<p>Unsaturated — contain a C=C double bond and undergo <em>addition</em> reactions. The test for unsaturation is decolourisation of bromine water.</p>
<p class="eq">C₂H₄ + Br₂ → C₂H₄Br₂ (colourless)</p>
<h2>7.4 IUPAC nomenclature in four steps</h2>
<ol><li>Find the longest continuous carbon chain (the parent).</li><li>Number the chain from the end nearer the first substituent or functional group.</li><li>Name and number substituents alphabetically.</li><li>Use the correct suffix: -ane, -ene, -yne, -ol, -al, -one, -oic acid.</li></ol>
<h2>7.5 Isomerism</h2>
<p>Compounds with the same molecular formula but different structures. Butane (C₄H₁₀) has two chain isomers: n-butane and 2-methylpropane.</p>`),

    chapter("JAMB","Biology","Modern Biology for Senior Secondary",9,"Genetics and Heredity",["Genetics","Cell Biology","Variation"],"Mendel's laws, monohybrid and dihybrid crosses, sex determination and genetic disorders.",`
<h2>9.1 Basic terms</h2>
<ul><li><strong>Gene</strong> — the unit of heredity carried on a chromosome.</li><li><strong>Allele</strong> — alternative form of a gene (e.g. T and t).</li><li><strong>Genotype</strong> — the genetic makeup (TT, Tt, tt).</li><li><strong>Phenotype</strong> — the observable characteristic (tall, short).</li><li><strong>Homozygous / heterozygous</strong> — identical / different alleles.</li></ul>
<h2>9.2 Mendel's first law (Law of Segregation)</h2>
<p>Each characteristic is controlled by a pair of alleles which separate during gamete formation so that each gamete carries only one allele.</p>
<h2>9.3 Monohybrid cross</h2>
<p>Tt × Tt gives the Punnett square:</p>
<table><tr><th></th><th>T</th><th>t</th></tr><tr><th>T</th><td>TT</td><td>Tt</td></tr><tr><th>t</th><td>Tt</td><td>tt</td></tr></table>
<p>Genotypic ratio 1 : 2 : 1 &nbsp;•&nbsp; Phenotypic ratio <strong>3 tall : 1 short</strong>.</p>
<h2>9.4 Dihybrid cross</h2>
<p>A cross of two heterozygotes for two traits (RrYy × RrYy) gives the classic phenotypic ratio <strong>9 : 3 : 3 : 1</strong>.</p>
<h2>9.5 Sex determination in humans</h2>
<p>Females are XX, males XY. The sex of a child is determined by whether the sperm carries X or Y — a 50 % chance either way.</p>
<h2>9.6 Genetic disorders</h2>
<p>Sickle-cell anaemia (HbS) is common in West Africa. Carriers (AS) are healthy and resistant to malaria; SS individuals are affected. AS × AS gives a 25 % chance of an SS child — the reason genotype screening before marriage is encouraged.</p>`),

    chapter("JAMB","Use of English","Countdown English Language",3,"Lexis, Structure and Concord",["Lexis and Structure","Concord","Synonyms","Antonyms"],"Subject–verb agreement, tenses, question tags and commonly tested structures.",`
<h2>3.1 Concord (subject–verb agreement)</h2>
<ul>
<li>Singular subject → singular verb: <em>The boy <strong>runs</strong>.</em></li>
<li>With <em>neither…nor / either…or</em>, the verb agrees with the <strong>nearer</strong> subject: <em>Neither the teacher nor the students <strong>were</strong> present.</em></li>
<li><em>Each, every, everybody, either, neither</em> are singular: <em>Each of the boys <strong>has</strong> a book.</em></li>
<li>Collective nouns take a singular verb when acting as a unit: <em>The team <strong>is</strong> winning.</em></li>
<li>Expressions of quantity: <em>Ten thousand naira <strong>is</strong> enough.</em></li>
</ul>
<h2>3.2 Question tags</h2>
<p>Positive statement → negative tag, and vice versa: <em>She is a nurse, <strong>isn't she</strong>?</em> / <em>He didn't come, <strong>did he</strong>?</em> Note the special case: <em>I am late, <strong>aren't I</strong>?</em></p>
<h2>3.3 Commonly confused words</h2>
<table><tr><th>Word</th><th>Meaning</th></tr>
<tr><td>affect / effect</td><td>verb (to influence) / noun (a result)</td></tr>
<tr><td>principal / principle</td><td>head of school / a rule or belief</td></tr>
<tr><td>stationary / stationery</td><td>not moving / writing materials</td></tr>
<tr><td>advice / advise</td><td>noun / verb</td></tr></table>
<h2>3.4 Idioms frequently tested</h2>
<ul><li><em>bury the hatchet</em> — make peace</li><li><em>a storm in a teacup</em> — a fuss about something trivial</li><li><em>bite the bullet</em> — endure a painful situation bravely</li><li><em>let the cat out of the bag</em> — reveal a secret</li></ul>
<h2>3.5 Strategy for the objective test</h2>
<p>Read all options before choosing. Eliminate obviously wrong answers first, then test the remaining ones inside the sentence — the ear is often a better judge than the rule.</p>`),

    chapter("JAMB","Economics","Fundamentals of Economics",4,"Demand, Supply and Price Determination",["Demand and Supply","Elasticity","Price"],"Laws of demand and supply, elasticity and market equilibrium.",`
<h2>4.1 Demand</h2>
<p><strong>Demand</strong> is the quantity of a commodity consumers are willing and able to buy at a given price over a period of time. The <em>law of demand</em>: as price rises, quantity demanded falls, other things being equal.</p>
<h2>4.2 Factors affecting demand</h2>
<ul><li>Price of the commodity</li><li>Income of consumers</li><li>Prices of related goods (substitutes and complements)</li><li>Taste and fashion</li><li>Population and expectations of future price</li></ul>
<h2>4.3 Supply</h2>
<p>Supply is the quantity producers are willing to offer for sale at a given price. Supply rises as price rises (direct relationship).</p>
<h2>4.4 Market equilibrium</h2>
<p>Equilibrium occurs where quantity demanded equals quantity supplied. Above equilibrium price there is a <em>surplus</em>; below it there is a <em>shortage</em>.</p>
<h2>4.5 Elasticity of demand</h2>
<p class="eq">Ed = (% change in quantity demanded) / (% change in price)</p>
<ul><li>Ed &gt; 1 → elastic (luxuries)</li><li>Ed &lt; 1 → inelastic (necessities, salt, kerosene)</li><li>Ed = 1 → unitary</li></ul>
<h2>4.6 Application: government price control</h2>
<p>A <strong>price ceiling</strong> (maximum price) below equilibrium creates shortages and black markets. A <strong>price floor</strong> (minimum price, e.g. minimum wage or guaranteed crop prices) creates surpluses.</p>`),
  ];
}
