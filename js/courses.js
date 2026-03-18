/**
 * ============================================================
 *  EEE COURSE MATERIALS — DATA FILE
 *  Edit this file to add/update courses, topics & materials
 * ============================================================
 *
 *  STRUCTURE:
 *  courses[] → each course has:
 *    id        : unique slug (used in URL)
 *    code      : course code shown on card
 *    name      : full course name
 *    icon      : emoji icon
 *    desc      : short description
 *    topics[]  → each topic has:
 *        id       : unique slug
 *        name     : topic name
 *        desc     : short description
 *        materials[] → each material has:
 *            type    : "pdf" | "code" | "notes" | "video" | "link"
 *            name    : display name
 *            url     : path relative to repo root OR external URL
 *            desc    : (optional) short note
 *
 *  HOW TO ADD A NEW COURSE:
 *    1. Copy a course block below and paste at the end of the array
 *    2. Change id, code, name, icon, desc
 *    3. Add your topics & materials
 *    4. Upload your files to the correct folder in the repo
 *
 * ============================================================
 */

const COURSES = [
  {
    id: "circuit-analysis",
    code: "EEE 101",
    name: "Circuit Analysis",
    icon: "🔌",
    desc: "KVL, KCL, Thevenin, Norton, AC/DC circuits and network theorems.",
    topics: [
      {
        id: "kvl-kcl",
        name: "KVL & KCL",
        desc: "Kirchhoff's Voltage and Current Laws — the foundation of circuit analysis.",
        materials: [
          {
            type: "notes",
            name: "KVL & KCL Lecture Notes",
            url: "materials/circuit-analysis/kvl-kcl-notes.md",
            desc: "Handwritten-style notes with examples"
          },
          {
            type: "pdf",
            name: "KVL KCL Practice Problems",
            url: "materials/circuit-analysis/kvl-kcl-problems.pdf",
            desc: "20 solved problems"
          }
        ]
      },
      {
        id: "thevenin-norton",
        name: "Thevenin & Norton Theorems",
        desc: "Simplifying complex networks into equivalent circuits.",
        materials: [
          {
            type: "pdf",
            name: "Thevenin Norton Notes (PDF)",
            url: "materials/circuit-analysis/thevenin-norton.pdf",
            desc: "Includes step-by-step method"
          },
          {
            type: "code",
            name: "Python: Thevenin Equivalent Solver",
            url: "materials/circuit-analysis/thevenin_solver.py",
            desc: "Compute Vth and Rth numerically"
          }
        ]
      },
      {
        id: "ac-circuits",
        name: "AC Circuit Analysis",
        desc: "Phasors, impedance, resonance, and power factor.",
        materials: [
          {
            type: "pdf",
            name: "AC Circuits Full Notes",
            url: "materials/circuit-analysis/ac-circuits.pdf",
            desc: "Covers phasors to resonance"
          }
        ]
      }
    ]
  },

  {
    id: "electronics",
    code: "EEE 201",
    name: "Electronics",
    icon: "💡",
    desc: "Diodes, BJTs, MOSFETs, op-amps, and amplifier circuits.",
    topics: [
      {
        id: "diodes",
        name: "Diodes & Applications",
        desc: "PN junction, rectifiers, clippers, clampers, and Zener diodes.",
        materials: [
          {
            type: "pdf",
            name: "Diodes Lecture Notes",
            url: "materials/electronics/diodes.pdf",
            desc: ""
          },
          {
            type: "code",
            name: "Diode IV Curve Plotter (MATLAB)",
            url: "materials/electronics/diode_iv.m",
            desc: "Plot I-V characteristic"
          }
        ]
      },
      {
        id: "bjt",
        name: "Bipolar Junction Transistors (BJT)",
        desc: "Biasing, small signal model, and BJT amplifiers.",
        materials: [
          {
            type: "pdf",
            name: "BJT Notes",
            url: "materials/electronics/bjt-notes.pdf",
            desc: ""
          }
        ]
      },
      {
        id: "opamp",
        name: "Operational Amplifiers",
        desc: "Inverting, non-inverting, integrator, differentiator, and comparators.",
        materials: [
          {
            type: "pdf",
            name: "Op-Amp Circuits Cheatsheet",
            url: "materials/electronics/opamp-cheatsheet.pdf",
            desc: "All standard op-amp configs"
          },
          {
            type: "code",
            name: "Op-Amp Simulation (Python)",
            url: "materials/electronics/opamp_sim.py",
            desc: "Simulates inverting amplifier"
          }
        ]
      }
    ]
  },

  {
    id: "signals-systems",
    code: "EEE 301",
    name: "Signals & Systems",
    icon: "📡",
    desc: "Continuous & discrete signals, Fourier, Laplace, and Z-transforms.",
    topics: [
      {
        id: "fourier-series",
        name: "Fourier Series",
        desc: "Representing periodic signals as sums of sinusoids.",
        materials: [
          {
            type: "pdf",
            name: "Fourier Series Notes",
            url: "materials/signals/fourier-series.pdf",
            desc: ""
          }
        ]
      },
      {
        id: "laplace-transform",
        name: "Laplace Transform",
        desc: "Circuit analysis and system analysis using Laplace.",
        materials: [
          {
            type: "pdf",
            name: "Laplace Transform Table",
            url: "materials/signals/laplace-table.pdf",
            desc: "Comprehensive table of pairs"
          },
          {
            type: "code",
            name: "Laplace Examples (Python/SymPy)",
            url: "materials/signals/laplace_examples.py",
            desc: ""
          }
        ]
      },
      {
        id: "z-transform",
        name: "Z-Transform",
        desc: "Analysis of discrete-time systems.",
        materials: [
          {
            type: "pdf",
            name: "Z-Transform Notes",
            url: "materials/signals/z-transform.pdf",
            desc: ""
          }
        ]
      }
    ]
  },

  {
    id: "power-systems",
    code: "EEE 401",
    name: "Power Systems",
    icon: "⚡",
    desc: "Generation, transmission, distribution, and protection of electrical power.",
    topics: [
      {
        id: "transmission-lines",
        name: "Transmission Lines",
        desc: "Line parameters, ABCD model, and performance equations.",
        materials: [
          {
            type: "pdf",
            name: "Transmission Line Notes",
            url: "materials/power/transmission-lines.pdf",
            desc: ""
          }
        ]
      },
      {
        id: "fault-analysis",
        name: "Fault Analysis",
        desc: "Symmetrical and unsymmetrical faults, sequence components.",
        materials: [
          {
            type: "pdf",
            name: "Fault Analysis Guide",
            url: "materials/power/fault-analysis.pdf",
            desc: ""
          }
        ]
      }
    ]
  },

  {
    id: "microprocessors",
    code: "EEE 305",
    name: "Microprocessors & Embedded Systems",
    icon: "🖥️",
    desc: "8051, ARM, Arduino, assembly programming, and interfacing.",
    topics: [
      {
        id: "8051-basics",
        name: "8051 Architecture & Assembly",
        desc: "Registers, memory, timers, interrupts, and basic programs.",
        materials: [
          {
            type: "pdf",
            name: "8051 Architecture Notes",
            url: "materials/microprocessors/8051-notes.pdf",
            desc: ""
          },
          {
            type: "code",
            name: "8051 Sample Programs",
            url: "materials/microprocessors/8051-programs/",
            desc: "LED blink, timer, UART examples"
          }
        ]
      },
      {
        id: "arduino",
        name: "Arduino Programming",
        desc: "GPIO, ADC, PWM, UART, I2C, SPI with practical examples.",
        materials: [
          {
            type: "code",
            name: "Arduino Starter Projects",
            url: "materials/microprocessors/arduino/",
            desc: "10 beginner projects with code"
          },
          {
            type: "pdf",
            name: "Arduino Pinout Reference",
            url: "materials/microprocessors/arduino-pinout.pdf",
            desc: ""
          }
        ]
      }
    ]
  },

  {
    id: "electromagnetic-fields",
    code: "EEE 202",
    name: "Electromagnetic Fields",
    icon: "🧲",
    desc: "Vector calculus, Maxwell's equations, electrostatics and magnetostatics.",
    topics: [
      {
        id: "vector-calculus",
        name: "Vector Calculus Basics",
        desc: "Gradient, divergence, curl, and integral theorems.",
        materials: [
          {
            type: "pdf",
            name: "Vector Calculus for EEE",
            url: "materials/emf/vector-calculus.pdf",
            desc: ""
          }
        ]
      },
      {
        id: "maxwells-equations",
        name: "Maxwell's Equations",
        desc: "Differential and integral forms, physical interpretation.",
        materials: [
          {
            type: "pdf",
            name: "Maxwell's Equations Summary",
            url: "materials/emf/maxwells-equations.pdf",
            desc: ""
          }
        ]
      }
    ]
  }
];
