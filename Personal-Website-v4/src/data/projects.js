import weatherApp from '../assets/weatherApp.gif'
import poly from '../assets/Poly.gif'
import insta from '../assets/Insta.gif'
import hash from '../assets/Hash.gif'
import cubes from '../assets/3D-Cubes.gif'
import mtc from '../assets/MultiThreadChat.gif'
import notex from '../assets/Notex.gif'
import gcar from '../assets/GCar.png'
import fakeMake from '../assets/FakeMake.gif'
import shell from '../assets/Shell.gif'
import kdTree from '../assets/KDTree.gif'

export const categories = [
  'All',
  'Software Development',
  'Machine Learning',
  'Computational Chemistry',
  'Low Level Programming',
]

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const raw = [
  {
    name: 'Multi-agent Framework for SOAP Note Generation',
    description:
      'End-to-end multi-stage clinical NLP pipeline that turns doctor-patient transcripts into structured SOAP notes. Hybrid local/cloud LLM routing with Ollama (Mistral, Llama 3.2) for generation and scoring, and Gemini for claim verification and prompt optimization. Closed-loop multi-agent feedback with UMLS validation, Pydantic claim decomposition, PrimeKG retrieval via GLiNER NER, and evaluation against ground truth (token F1, ROUGE-L, LLM-as-a-judge) across 200+ transcripts.',
    tags: ['Machine Learning', 'Software Development'],
    skills: [
      'Python',
      'Ollama',
      'Gemini',
      'Pydantic',
      'UMLS',
      'GLiNER',
      'PrimeKG',
      'Multi-agent Systems',
      'NLP',
    ],
  },
  {
    name: 'Graph Attention Network for Molecular Property Prediction',
    description:
      'Graph attention networks for molecular property prediction on QM9 (HOMO-LUMO gaps, validation MSE 0.05) and HIV (active molecule classification, ROC-AUC 0.82). Custom 36-dimensional molecular feature set for graph node initialization, with comparative analysis against CNNs and molecular fingerprint baselines.',
    tags: ['Machine Learning', 'Computational Chemistry'],
    skills: [
      'Python',
      'PyTorch',
      'Graph Attention Networks',
      'QM9',
      'HIV Dataset',
      'Molecular Features',
      'Deep Learning',
    ],
  },
  {
    name: 'Genetic Algorithm for Structural Bridge Design',
    description:
      'Evolutionary genetic algorithm that generates and optimizes bridge designs, balancing structural efficiency against material and construction costs. Customized an open-source physics simulator for structural constraints, load testing, and custom evaluation metrics. Tournament selection, crossover, mutation, and elitism to avoid premature convergence.',
    tags: ['Machine Learning', 'Software Development'],
    skills: [
      'Python',
      'Genetic Algorithms',
      'Physics Simulation',
      'Optimization',
      'Structural Design',
    ],
  },
  {
    name: '3D Rotating ASCII Cube',
    description:
      'A mini project exploring a 3D rotating cube rendered with ASCII characters, projected onto a 2D plane. The cube can be selected and translated in the x and y plane.',
    tags: ['Low Level Programming'],
    skills: ['C++', 'ASCII Art', 'Screen Buffering', '2D-3D Projections', 'Linear Algebra'],
    image: cubes,
  },

  {
    name: 'Notex',
    description:
      'Full-stack desktop note-taking app. Architected data structure and frontend/backend integration with React, Electron, Flask, and PostgreSQL so notes stay in sync.',
    tags: ['Software Development'],
    skills: ['React', 'PostgreSQL', 'Electron', 'Flask', 'Python', 'JavaScript'],
    image: notex,
  },
  {
    name: 'Credit Card Fraud Detection',
    description:
      'Ensemble voting classifier (logistic regression, random forest, gradient boosting) with 97% accuracy on the Kaggle credit card fraud dataset. Owned preprocessing and the random forest model.',
    tags: ['Machine Learning'],
    skills: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  {
    name: 'Malloc Implementation',
    description:
      'Custom malloc, free, and coalesce free-list functions in C using sbrk, exploring memory management under the hood.',
    tags: ['Low Level Programming'],
    skills: ['C', 'Memory Management', 'System Calls', 'Data Structures'],
  },
  {
    name: 'Gesture Control Car',
    description:
      'Remote-controlled car driven by sign language. Integrated React, Flask Socket.IO, Arduino Uno, and a TensorFlow model for real-time streaming across frontend, backend, and hardware.',
    tags: ['Machine Learning', 'Software Development'],
    skills: ['Python', 'OpenCV', 'TensorFlow', 'React', 'Flask'],
    image: gcar,
  },
  {
    name: 'Multithreaded Chat Server',
    description:
      'Socket-based chat server supporting multiple clients and group chats with multithreading, mutexes, and data synchronization.',
    tags: ['Low Level Programming'],
    skills: ['C', 'Multithreading', 'Networking', 'Sockets', 'Mutexes'],
    image: mtc,
  },
  {
    name: 'Fake Make',
    description:
      'Implementation of make that reads *.fm files, resolves dependencies, and builds targets with topological sorting.',
    tags: ['Low Level Programming'],
    skills: ['C', 'Makefile', 'Shell Scripting', 'Data Structures', 'Topological Sorting'],
    image: fakeMake,
  },
  {
    name: 'Polynomial Regression',
    description:
      'Interactive polynomial regression: place points on a canvas and watch parameters update continuously to fit the curve.',
    tags: ['Machine Learning'],
    skills: ['TensorFlow.js', 'p5.js', 'JavaScript'],
    image: poly,
  },
  {
    name: 'Weather App',
    description:
      'MERN weather app with OpenWeatherMap, Rainviewer map layer, and Spotify recommendations based on conditions.',
    tags: ['Software Development'],
    skills: ['React', 'Express.js', 'MongoDB', 'Spotify API', 'JavaScript'],
    image: weatherApp,
  },
  {
    name: 'Instigram',
    description:
      'Instagram frontend copy built with HTML, CSS, and JavaScript to practice implementing software from a given design.',
    tags: ['Software Development'],
    skills: ['JavaScript', 'HTML', 'CSS'],
    image: insta,
  },
  {
    name: 'Website Portfolio',
    description: 'Personal website portfolio.',
    tags: ['Software Development'],
    skills: ['React', 'Tailwind', 'JavaScript'],
  },
  {
    name: 'Hashing Algorithm',
    description:
      'Hash table with Last7 and XOR hash functions and linear probing / double hashing collision strategies.',
    tags: ['Low Level Programming'],
    skills: ['C', 'Hashing', 'Data Structures', 'Algorithms'],
    image: hash,
  },
  {
    name: 'Shell Implementation',
    description: 'Custom shell that executes commands with forking, pipes, and system calls.',
    tags: ['Low Level Programming'],
    skills: ['C', 'Shell Scripting', 'System Calls', 'Forking', 'Pipes'],
    image: shell,
  },
  {
    name: 'KD Tree',
    description:
      '2D KD tree on a canvas: click to add points, hover to highlight children. Built with C++ and SFML.',
    tags: ['Machine Learning', 'Low Level Programming'],
    skills: ['C++', 'SFML', 'Data Structures', 'Algorithms'],
    image: kdTree,
  },
  {
    name: 'LLM-based Molecule Generator',
    description:
      'Molecule generator using Transpharmer with reinforcement learning toward higher binding affinity and drug-likeness, evaluated with RDKit.',
    tags: ['Computational Chemistry', 'Machine Learning', 'Software Development'],
    skills: ['Python', 'Pandas', 'NumPy', 'Reinforcement Learning', 'Rdkit'],
  },
]

export const projects = raw.map((p) => ({
  ...p,
  slug: slugify(p.name),
}))
