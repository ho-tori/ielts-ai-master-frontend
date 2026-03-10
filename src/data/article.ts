import type { Exercise, Article, Question } from '../types/article'

/**
 * 测试数据 - 习题集
 */
export const mockExercises: Exercise[] = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 450,
    estimatedTime: '12 min',
    description: '关于人工智能发展趋势的学术文章，涵盖机器学习、深度学习等内容',
    tags: ['AI', '科技', '机器学习'],
    completed: false,
    score: 0
  },
  {
    id: 2,
    title: 'Climate Change and Global Warming',
    category: 'academic',
    difficulty: 'hard',
    wordCount: 520,
    estimatedTime: '15 min',
    description: '深度讨论气候变化和全球变暖的科学证据和影响',
    tags: ['环境', '气候', '科学'],
    completed: true,
    score: 85
  },
  {
    id: 3,
    title: 'Breaking News: Major Discovery in Physics',
    category: 'news',
    difficulty: 'medium',
    wordCount: 380,
    estimatedTime: '10 min',
    description: '物理学领域的重要发现，涉及量子计算',
    tags: ['物理', '新闻', '科学发现'],
    completed: false,
    score: 0
  },
  {
    id: 4,
    title: 'The Lost City: A Mystery Novel',
    category: 'fiction',
    difficulty: 'easy',
    wordCount: 420,
    estimatedTime: '11 min',
    description: '冒险小说，讲述考古学家寻找失落古城的故事',
    tags: ['冒险', '小说', '考古'],
    completed: true,
    score: 92
  },
  {
    id: 5,
    title: 'Digital Revolution in Education',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 480,
    estimatedTime: '13 min',
    description: '探讨数字技术如何改变现代教育',
    tags: ['教育', '技术', '数字化'],
    completed: false,
    score: 0
  },
  {
    id: 6,
    title: 'Sustainable Fashion Industry',
    category: 'news',
    difficulty: 'easy',
    wordCount: 320,
    estimatedTime: '9 min',
    description: '时尚业的可持续发展趋势',
    tags: ['环保', '时尚', '可持续'],
    completed: true,
    score: 88
  },
  {
    id: 7,
    title: 'The Impact of Social Media',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 410,
    estimatedTime: '11 min',
    description: '社交媒体对现代社会的影响分析',
    tags: ['社交媒体', '社会', '技术'],
    completed: false,
    score: 0
  },
  {
    id: 8,
    title: 'Innovation in Healthcare',
    category: 'news',
    difficulty: 'hard',
    wordCount: 490,
    estimatedTime: '14 min',
    description: '医疗健康领域的创新发展',
    tags: ['医疗', '健康', '创新'],
    completed: true,
    score: 79
  },
  {
    id: 9,
    title: 'The Mystery of Sleep',
    category: 'fiction',
    difficulty: 'medium',
    wordCount: 380,
    estimatedTime: '10 min',
    description: '关于睡眠科学的有趣故事',
    tags: ['科学', '睡眠', '生物学'],
    completed: false,
    score: 0
  },
  {
    id: 10,
    title: 'Ocean Conservation Efforts',
    category: 'academic',
    difficulty: 'easy',
    wordCount: 350,
    estimatedTime: '9 min',
    description: '海洋保护的全球努力',
    tags: ['环境', '海洋', '保护'],
    completed: true,
    score: 95
  },
  {
    id: 11,
    title: 'Ancient Civilizations',
    category: 'fiction',
    difficulty: 'hard',
    wordCount: 510,
    estimatedTime: '15 min',
    description: '古代文明的探索与发现',
    tags: ['历史', '考古', '文明'],
    completed: false,
    score: 0
  },
  {
    id: 12,
    title: 'Modern Architecture Trends',
    category: 'news',
    difficulty: 'medium',
    wordCount: 420,
    estimatedTime: '12 min',
    description: '现代建筑设计的最新趋势',
    tags: ['建筑', '设计', '艺术'],
    completed: true,
    score: 81
  }
]

/**
 * 测试数据 - 题目
 */
export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'TRUE_FALSE_NOT_GIVEN',
    questionText: 'Artificial Intelligence will replace all human jobs by 2030.',
    answer: 'FALSE',
    userAnswer: 'FALSE',
    explanation: '虽然AI会改变许多工作性质，但不会在2030年前完全替代所有人工工作。',
    difficulty: 'medium'
  },
  {
    id: '2',
    type: 'MULTIPLE_CHOICE',
    questionText: 'What is the main focus of the article?',
    options: [
      'A. The history of AI development',
      'B. Future trends in AI technology',
      'C. The dangers of artificial intelligence',
      'D. AI programming techniques'
    ],
    answer: 'B',
    userAnswer: 'B',
    explanation: '文章主要讨论的是人工智能技术的未来发展趋势。',
    difficulty: 'easy'
  },
  {
    id: '3',
    type: 'TRUE_FALSE_NOT_GIVEN',
    questionText: 'Machine learning is more advanced than deep learning.',
    answer: 'NOT GIVEN',
    userAnswer: 'NOT GIVEN',
    explanation: '文章中未提及机器学习与深度学习的先进程度对比。',
    difficulty: 'hard'
  },
  {
    id: '4',
    type: 'MULTIPLE_CHOICE',
    questionText: 'Which of the following is NOT mentioned in the passage?',
    options: [
      'A. Machine learning',
      'B. Deep learning',
      'C. Quantum computing',
      'D. Neural networks'
    ],
    answer: 'C',
    userAnswer: 'C',
    explanation: '文章中没有提及量子计算的相关内容。',
    difficulty: 'medium'
  },
  {
    id: '5',
    type: 'TRUE_FALSE_NOT_GIVEN',
    questionText: 'The article was published in an academic journal.',
    answer: 'NOT GIVEN',
    userAnswer: undefined,
    explanation: '文章来源未在题目中说明。',
    difficulty: 'easy'
  }
]

export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    category: 'academic',
    source: 'Nature Magazine',
    content: `Artificial Intelligence (AI) has emerged as one of the most transformative technologies of our time. 
From machine learning algorithms that power recommendation systems to deep learning neural networks that 
enable autonomous vehicles, AI is reshaping every aspect of our society.

The rapid advancement in AI technology is driven by several factors: the exponential growth of computational 
power, the availability of massive datasets, and the development of sophisticated algorithms. Companies like 
Google, Microsoft, and Tesla are investing billions into AI research and development.

However, this rapid progress also raises important questions about ethics, privacy, and employment. 
As AI systems become more powerful and autonomous, we must carefully consider their societal impact.

Looking ahead, we can expect AI to continue to evolve and find new applications in healthcare, finance, 
transportation, and education. The challenge for humanity will be to harness the power of AI while 
mitigating its risks.`,
    questions: mockQuestions.slice(0, 3),
    author: 'Dr. John Smith',
    publishDate: '2024-01-15',
    wordCount: 450,
    readingTime: 12
  },
  {
    id: 2,
    title: 'Climate Change and Global Warming',
    category: 'academic',
    source: 'Science Today',
    content: `Climate change represents one of the greatest challenges facing humanity in the 21st century. 
The scientific consensus is overwhelming: human activities, particularly the emission of greenhouse gases, 
are causing the Earth's climate to warm at an unprecedented rate.

The evidence is everywhere. Global temperatures have risen by approximately 1.1°C since the pre-industrial era. 
Arctic sea ice is melting at alarming rates. Sea levels are rising, threatening coastal communities. 
And we are witnessing more frequent and intense weather events such as hurricanes, droughts, and floods.

The causes are well-established. Burning fossil fuels releases carbon dioxide and other greenhouse gases. 
Deforestation reduces the Earth's capacity to absorb CO2. Industrial agriculture contributes methane emissions. 
These activities trap heat in the atmosphere, leading to global warming.

The solutions require urgent action on multiple fronts: transitioning to renewable energy sources, implementing 
carbon pricing mechanisms, protecting and restoring forests, and improving energy efficiency. 
The time for action is now.`,
    questions: mockQuestions.slice(0, 5),
    author: 'Prof. Sarah Johnson',
    publishDate: '2024-02-20',
    wordCount: 520,
    readingTime: 15
  },
  {
    id: 3,
    title: 'Breaking News: Major Discovery in Physics',
    category: 'news',
    source: 'Science News Daily',
    content: `Scientists have announced a major breakthrough in quantum computing that could revolutionize technology 
as we know it. Researchers at leading laboratories have demonstrated a quantum computer capable of performing 
calculations that would be impossible for classical computers.

The breakthrough involves the development of more stable quantum bits (qubits) that can maintain their quantum 
state for longer periods. This advancement addresses one of the fundamental challenges in quantum computing.

According to the research team, this development could have profound implications for drug discovery, materials 
science, cryptography, and artificial intelligence. The technology is still in early stages, but experts believe 
it could lead to practical applications within the next decade.

Major technology companies are already investing heavily in quantum computing research. Google, IBM, and others 
are racing to develop the next generation of quantum computers.

However, experts caution that there are still significant challenges to overcome before quantum computers become 
widely available. The technology requires extremely cold operating temperatures and specialized infrastructure.`,
    questions: mockQuestions.slice(1, 4),
    author: 'Michael Chen',
    publishDate: '2024-03-10',
    wordCount: 380,
    readingTime: 10
  },
  {
    id: 4,
    title: 'The Lost City: A Mystery Novel',
    category: 'fiction',
    source: 'Adventure Publishers',
    content: `Deep in the jungles of South America, archaeologist Dr. Elena Vasquez discovered something extraordinary: 
fragments of pottery bearing ancient symbols unlike anything documented in academic literature.

Her discovery led her to investigate rumors of a lost city hidden beneath centuries of dense vegetation. 
Local guides spoke of "El Ciudad Perdida," a settlement built by an advanced pre-Columbian civilization.

What started as a theoretical investigation became an obsession. Elena assembled a team of specialists: 
a geographer, a historian, and local guides who knew the jungle intimately. Together, they ventured 
into uncharted territory, facing dense forests, treacherous rivers, and the constant threat of danger.

After weeks of grueling exploration, they found it—stone structures emerging from the jungle, 
intricately carved with symbols that matched Elena's pottery fragments. The city was vast, 
with temples, residences, and intricate water systems.

The discovery challenged everything archaeologists thought they knew about pre-Columbian civilizations. 
As Elena documented every detail, she realized this find would revolutionize the field of archaeology.`,
    questions: mockQuestions.slice(0, 3),
    author: 'Victoria Martinez',
    publishDate: '2024-01-28',
    wordCount: 420,
    readingTime: 11
  },
  {
    id: 5,
    title: 'Digital Revolution in Education',
    category: 'academic',
    source: 'Educational Review',
    content: `The integration of digital technology into educational systems represents one of the most significant 
transformations in the history of learning. From interactive whiteboards to learning management systems, 
technology is fundamentally changing how students learn and teachers teach.

Online learning platforms have democratized education, making quality learning resources accessible to students 
worldwide regardless of geographic location or socioeconomic status. Students can now access lectures from 
leading universities, participate in virtual classrooms, and collaborate with peers globally.

Artificial intelligence is playing an increasingly important role in personalized learning. AI tutoring systems 
can adapt to individual student learning styles and pace, providing customized feedback and recommendations.

However, the digital revolution also presents challenges. The digital divide continues to exist, with many 
students lacking adequate access to technology and internet connectivity. Privacy concerns regarding student 
data collection and usage require careful regulation.

Looking forward, the future of education will likely be a blend of physical and digital experiences, 
where technology enhances rather than replaces human interaction and mentorship.`,
    questions: mockQuestions.slice(0, 5),
    author: 'Dr. Robert Wilson',
    publishDate: '2024-02-05',
    wordCount: 480,
    readingTime: 13
  },
  {
    id: 6,
    title: 'Sustainable Fashion Industry',
    category: 'news',
    source: 'Eco News Weekly',
    content: `The fashion industry, long criticized for its environmental impact, is undergoing a green transformation. 
Leading brands are increasingly adopting sustainable practices as consumer demand for eco-friendly fashion grows.

Fast fashion has dominated the industry for decades, but its environmental cost is becoming impossible to ignore. 
The fashion industry produces 10% of global carbon emissions and generates massive amounts of textile waste.

Progressive companies are responding by implementing sustainable practices: using organic materials, 
reducing water consumption in production, implementing fair labor practices, and designing for longevity 
rather than disposability.

Innovative startups are also disrupting the industry with sustainable alternatives. Some companies create 
fabrics from recycled plastics, others develop biodegradable materials, and many promote clothing rental 
and resale platforms as alternatives to new purchases.

Consumer awareness is driving this change. Younger generations increasingly prefer brands that demonstrate 
environmental and social responsibility. As sustainability becomes a competitive advantage, more companies 
will be forced to transform their practices.`,
    questions: mockQuestions.slice(1, 4),
    author: 'Lisa Anderson',
    publishDate: '2024-03-02',
    wordCount: 320,
    readingTime: 9
  },
  {
    id: 7,
    title: 'The Impact of Social Media',
    category: 'academic',
    source: 'Social Science Review',
    content: `Social media has become an integral part of modern life, fundamentally changing how humans communicate, 
consume information, and organize society. With billions of users worldwide, platforms like Facebook, Twitter, 
and Instagram have immense influence on public discourse and individual behavior.

The benefits are undeniable. Social media enables connection across geographic boundaries, giving voice to 
marginalized communities and facilitating social movements. During crises, it serves as a vital communication channel.

However, the negative impacts are equally significant. Social media has been linked to increased anxiety and 
depression, particularly among young people. The spread of misinformation and conspiracy theories can distort 
public understanding of critical issues. Cyberbullying has created new venues for harassment.

Algorithm-driven content feeds create "filter bubbles" that reinforce existing beliefs rather than exposing 
people to diverse perspectives. This polarization affects politics, public health, and social cohesion.

As society grapples with social media's impact, policymakers and tech companies face increasing pressure 
to implement safeguards that protect users while preserving the platforms' benefits.`,
    questions: mockQuestions.slice(0, 5),
    author: 'Dr. James Harris',
    publishDate: '2024-02-14',
    wordCount: 410,
    readingTime: 11
  },
  {
    id: 8,
    title: 'Innovation in Healthcare',
    category: 'news',
    source: 'Medical Times',
    content: `The healthcare industry is experiencing unprecedented innovation driven by technological advances and 
changing patient expectations. From telemedicine to precision medicine, new approaches are improving outcomes 
and making healthcare more accessible.

Telemedicine has revolutionized healthcare delivery, particularly in remote areas and during crises like the 
COVID-19 pandemic. Patients can now consult with specialists without traveling, reducing wait times and costs.

Artificial intelligence is transforming diagnostics. Machine learning algorithms can detect diseases like cancer 
and diabetic retinopathy earlier than human physicians, improving survival rates.

Personalized medicine, enabled by genetic sequencing and data analytics, allows treatment plans tailored to 
individual patients' genetic profiles. This approach is proving more effective than one-size-fits-all treatments.

Innovative medical devices, from portable ultrasound devices to wearable health monitors, are bringing 
sophisticated diagnostics to underserved populations. 3D printing is being used to create custom prosthetics 
and surgical implants.

These innovations, combined with increased investment in healthcare technology, promise to make healthcare 
more efficient, effective, and equitable globally.`,
    questions: mockQuestions.slice(1, 4),
    author: 'Dr. Margaret Liu',
    publishDate: '2024-02-28',
    wordCount: 490,
    readingTime: 14
  },
  {
    id: 9,
    title: 'The Mystery of Sleep',
    category: 'fiction',
    source: 'Science Fiction Quarterly',
    content: `Dr. Nathan Cross had always been fascinated by sleep, that mysterious state where consciousness 
surrenders and the mind enters another world. His research into sleep science had consumed his life, 
leaving little room for anything else—until the experiment.

The neural interface device he developed promised unprecedented insights into the sleeping brain. 
By mapping neural activity in real-time, he could essentially "read" dreams, perhaps even control them.

Nathan became his own test subject, spending nights connected to the device, exploring the vast landscape 
of his subconscious. What he discovered unsettled him: his dreams were far too coherent, too realistic. 
They didn't fade upon waking like normal dreams. They persisted with vivid clarity.

Then came the revelation that turned his world upside down: the waking world and dreams were bleeding together. 
He couldn't distinguish where one ended and the other began. His colleagues grew concerned as Nathan's behavior 
became increasingly erratic.

In the end, Nathan realized that sleep wasn't an escape from reality—it was a gateway to something far more profound.`,
    questions: mockQuestions.slice(0, 3),
    author: 'Patricia Thompson',
    publishDate: '2024-01-20',
    wordCount: 380,
    readingTime: 10
  },
  {
    id: 10,
    title: 'Ocean Conservation Efforts',
    category: 'academic',
    source: 'Environmental Science Quarterly',
    content: `Our oceans cover 71% of Earth's surface and contain 97% of its water, yet marine ecosystems face 
unprecedented threats from pollution, overfishing, climate change, and ocean acidification.

Global efforts to protect marine biodiversity have intensified in recent years. Protected marine areas now 
cover approximately 8% of the ocean, with ambitious goals to expand coverage significantly by 2030.

Coral reef conservation has become a priority as these ecosystems, home to 25% of marine species, face bleaching 
from warming waters. Scientists are developing innovative solutions, from artificial coral nurseries to genetic 
adaptation research.

Sustainable fishing practices are essential for preserving fish populations and the livelihoods of fishing 
communities. International agreements on fishing quotas and marine protected areas aim to balance conservation 
with economic needs.

Ocean cleanup initiatives are tackling plastic pollution, the Great Pacific Garbage Patch serving as a stark 
reminder of humanity's impact on marine environments.

International cooperation through organizations like the UN is crucial. The UN Sustainable Development Goal 14 
aims to conserve and sustainably use oceans, seas, and marine resources by 2030.`,
    questions: mockQuestions.slice(0, 5),
    author: 'Prof. David Turner',
    publishDate: '2024-02-10',
    wordCount: 350,
    readingTime: 9
  },
  {
    id: 11,
    title: 'Ancient Civilizations',
    category: 'fiction',
    source: 'Historical Fiction Press',
    content: `The discovery changed everything. Archaeologist Dr. Amara Okonkwo uncovered evidence of a previously 
unknown advanced civilization that flourished thousands of years before the Egyptian pyramids.

Hidden beneath desert sands in North Africa lay the ruins of a sophisticated society. The artifacts revealed 
a culture with advanced astronomical knowledge, intricate trade networks, and architectural marvels.

How had this civilization been forgotten by history? Amara delved deeper into the mystery, piecing together 
fragments of evidence—pottery, inscriptions, and structures that defied conventional understanding of ancient 
human capabilities.

Her research suggested that documented history represented only a fraction of human achievement. There were 
other civilizations, other accomplishments, other stories waiting to be discovered.

As she reconstructed the daily life of this ancient people through their artifacts, Amara realized that 
discovering the past required not just excavation but imagination—the ability to see humanity's full potential 
across millennia.

Her findings would fundamentally reshape how scholars understood human civilization and our species' 
capacity for achievement.`,
    questions: mockQuestions.slice(1, 5),
    author: 'Harrison Freeman',
    publishDate: '2024-01-30',
    wordCount: 510,
    readingTime: 15
  },
  {
    id: 12,
    title: 'Modern Architecture Trends',
    category: 'news',
    source: 'Design Magazine',
    content: `Contemporary architecture is being shaped by sustainability, technology, and changing human needs. 
Architects worldwide are reimagining what buildings can be and how they can serve society better.

Sustainable design is no longer optional—it's becoming standard. Buildings are being designed to minimize 
energy consumption, incorporate renewable energy, and use sustainable materials. Green roofs and walls provide 
insulation while creating urban green spaces.

Smart buildings equipped with IoT sensors and AI systems optimize energy use, climate control, and security 
in real-time. These technologies not only reduce environmental impact but also improve occupant comfort and health.

Urban density challenges have led architects to innovate vertically. Skyscrapers now incorporate vertical gardens, 
wind turbines, and sophisticated water recycling systems, transforming them from environmental liabilities 
into ecological assets.

Mixed-use developments that combine residential, commercial, and recreational spaces are becoming increasingly 
popular, creating vibrant urban communities and reducing transportation needs.

Adaptive reuse—converting old buildings into new purposes—is growing in popularity, preserving historical 
character while meeting contemporary needs.

These trends reflect a broader shift in architecture toward creating buildings that are environmentally 
responsible, technologically sophisticated, and deeply connected to human wellbeing.`,
    questions: mockQuestions.slice(0, 4),
    author: 'Elena Rossi',
    publishDate: '2024-03-08',
    wordCount: 420,
    readingTime: 12
  }
]