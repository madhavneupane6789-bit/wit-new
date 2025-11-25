import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: Role.ADMIN,
      isApproved: true,
      isActive: true,
    },
  });

  const sectionCount = await prisma.syllabusSection.count();
  if (sectionCount === 0) {
    const root = await prisma.syllabusSection.create({
      data: {
        title: 'NEA Level 7 Electrical Engineering Syllabus',
        content: 'नेपाल विद्युत प्राधिकरण प्राविधिक सेवा, तह ७ (इलेक्ट्रिकल) को विस्तृत पाठ्यक्रम।',
        order: 0,
      },
    });

    const firstPaper = await prisma.syllabusSection.create({
      data: {
        title: 'प्रथम पत्र - सामान्य ज्ञान र व्यवस्थापन',
        content:
          'सामान्य ज्ञान, भौगोलिक र सामाजिक संरचना, उर्जा विकास, संघीय शासन प्रणाली, अन्तर्राष्ट्रिय संस्था SAARC/UNO, समसामयिक घटना, बौद्धिक परीक्षण (Verbal/Non-verbal), संख्यात्मक क्षमता, तथा प्रशासनिक/संगठन व्यवस्थापनका आधारभूत सिद्धान्तहरू।',
        parentId: root.id,
        order: 0,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'सामान्य ज्ञान र बौद्धिक परीक्षण',
        content:
          'नेपालको भूगोल, जलवायु, नदी/ताल, खनिज, उर्जा, शिक्षा, स्वास्थ्य, सञ्चार; सामाजिक र सांस्कृतिक विविधता; विद्युत विकास र सम्भावना; संघीय संरचना; विश्व भूगोल, महादेश/महासागर, अक्षांश/देशान्तर; SAARC, UNO; समसामयिक घटना; Verbal/Non-verbal aptitude, Numerical ability (Ohm’s law, profit-loss, ratio, percentage, direction, series आदि)।',
        parentId: firstPaper.id,
        order: 0,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'संस्थागत र कानूनी रूपरेखा',
        content:
          'नेपालको संविधान, विद्युत ऐन २०४९, नेपाल विद्युत प्राधिकरण ऐन २०४१, विद्युत नियमन आयोग ऐन २०७४, सार्वजनिक खरिद ऐन २०६३, सुशासन ऐन २०६४, जग्गा अधिग्रहण ऐन २०३४, वातावरण संरक्षण ऐन २०७६/नियमावली २०७७, प्राधिकरणको सेवा/वित्तीय नियमावली, भ्रष्टाचार निवारण ऐन २०५९।',
        parentId: firstPaper.id,
        order: 1,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'व्यवस्थापन, वित्त र विकास',
        content:
          'व्यवस्थापनका आधारभूत सिद्धान्त: Motivation, Leadership, Control, Coordination, Decision making, Strategic Management, Corporate Social Responsibility; परियोजना व्यवस्थापन (CPM/PERT, HR planning, Resource scheduling, Monitoring/Control, Project control cycle); वित्तीय विश्लेषण (B/C, IRR/EIRR/FIRR, NPV, Payback); विद्युत दर संरचना; विकास प्रशासन, PPP, दिगो विकास, योजना निर्माण।',
        parentId: firstPaper.id,
        order: 2,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'विद्युत क्षेत्रका नयाँ प्रवृत्ति',
        content:
          'ऊर्जा स्रोतहरू, IPP को भूमिका, PPA/PDA, ऊर्जा बैंकिङ, विनिमय पूल बजार, क्षेत्रीय/उप-क्षेत्रीय ग्रिड अन्तरसम्बन्ध, विश्व र नेपालका हालका प्रवृत्ति।',
        parentId: firstPaper.id,
        order: 3,
      },
    });

    const secondPaper = await prisma.syllabusSection.create({
      data: {
        title: 'द्वितीय पत्र - प्राविधिक विस्तृत ज्ञान',
        content:
          'विद्युत इन्जिनियरिङ् आधारभूत, मेसिनहरू, उत्पादन, प्रसारण/वितरण, प्रणाली विश्लेषण, पावर इलेक्ट्रोनिक्स, स्विच्गियर/प्रोटेक्सन, उपभोक्ता सेवा, अर्थशास्त्र, सुरक्षा, इन्स्ट्रुमेन्टेसन/कन्ट्रोल र प्रयोगशाला मानक।',
        parentId: root.id,
        order: 1,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Electrical Engineering Fundamentals',
        content:
          'Charge/current, AC/DC, Ohm/Kirchhoff, Star-Delta, Network theorems (Superposition, Thevenin, Norton, Max power), RLC transients, Laplace/Transfer function, three-phase systems, active/reactive power, resonance, operational amplifiers, two-port networks.',
        parentId: secondPaper.id,
        order: 0,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Electrical Machines',
        content:
          'Magnetic circuits, hysteresis/eddy losses; Transformers (equivalent circuit, efficiency, regulation, testing, grounding, parallel, auto/instrument); DC machines (types, characteristics, speed control); Synchronous machines (operation, excitation, governor, hunting); Induction machines (motor/generator, starters, speed control, selection).',
        parentId: secondPaper.id,
        order: 1,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Power Generation',
        content:
          'Hydro plants (site, layout, turbines, alternators, auxiliaries, Nepal plants), Diesel plants, Renewable (micro hydro, solar PV, wind, geothermal, tidal), Generation economics (load curve, demand/plant/use factors, diversity).',
        parentId: secondPaper.id,
        order: 2,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Transmission and Distribution',
        content:
          'Voltage choice, conductor/insulator selection, span/sag-tension, vibration dampers, clearances, towers/ROW; line parameters, ABCD, SIL, Ferranti effect; corona (loss/noise/RI); inductive interference; distribution feeders, substations, bus schemes, PF correction, reactive compensation, reliability indices, oil, metering.',
        parentId: secondPaper.id,
        order: 3,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Power System Analysis',
        content:
          'Load flow basics, voltage/frequency balance, VAR compensation, PF improvement; Stability (steady, dynamic, transient, swing equation, equal area); Faults (sym/unsym), protection components; ELDC principles, dispatch tools/benefits; transmission/distribution layout and reliability; supply quality standards.',
        parentId: secondPaper.id,
        order: 4,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Power Electronics',
        content:
          'Devices (diode, BJT, MOSFET, thyristor, GTO, IGBT); rectifiers (controlled/uncontrolled), inverters (VSI/CSI), harmonic filtering; choppers, cycloconverters, AC controllers; intro to HVDC.',
        parentId: secondPaper.id,
        order: 5,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Switchgear and Protection',
        content:
          'Relays (electromagnetic/static/digital), protection of generator/transformer/lines; circuit breakers (ACB/OCB/VCB/ABCB/SF6); over-voltage and lightning protection, surge arresters; substations (indoor/outdoor, bus arrangements, earthing).',
        parentId: secondPaper.id,
        order: 6,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Power Distribution and Consumer Services',
        content:
          'Substation/switchyard layout, underground cables (selection, joints, protection), single-wire distribution, lightning arrestors, earth wire, voltage drop/Ferranti, SIL, earthing methods and importance.',
        parentId: secondPaper.id,
        order: 7,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Economics of Power Utilization',
        content:
          'Energy audit basics, load management/DSM, TOD meter, PF improvement methods/benefits, load forecast, demand/load/plant/diversity factors, depreciation, rate of return, tariff structures.',
        parentId: secondPaper.id,
        order: 8,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Safety Engineering',
        content:
          'Electric shock effects, first aid, safety rules, live-line maintenance precautions, safety tools/standards, earthing/shielding, earth resistance tests, fire hazards and firefighting equipment.',
        parentId: secondPaper.id,
        order: 9,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Instrumentation and Control',
        content:
          'Electrical measurements (analog/digital, precision/error), sensors/transducers for speed/position/flow/temp, feedback control (time/frequency response, stability, root locus, bode), PID control, converters (ADC/DAC).',
        parentId: secondPaper.id,
        order: 10,
      },
    });

    await prisma.syllabusSection.create({
      data: {
        title: 'Testing Laboratory Standards',
        content: 'Technical standards, accreditation, calibration of testing devices for electrical machines and equipment.',
        parentId: secondPaper.id,
        order: 11,
      },
    });

    console.log('Seeded syllabus sections (NEA Level 7)');
  }

  console.log('Seed completed: admin@example.com / Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
