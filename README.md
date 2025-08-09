# StarStrike: Cosmic Mining Consortium

A 3D blockchain-powered space mining game built with Honeycomb Protocol, where player progression, achievements, and consortium membership are permanently stored on-chain.

## 🎮 Game Concept

StarStrike is a 3D space mining simulation where players pilot ships through asteroid fields, complete missions, and participate in a decentralized mining consortium. Unlike traditional games, all player progress, skills, and consortium decisions are stored permanently on the Solana blockchain using Honeycomb Protocol.

### Core Game Loop
1. **Connect Wallet** → Spawn in 3D space station
2. **Accept Missions** → Honeycomb Protocol generates daily mining quotas, exploration tasks, and convoy protection missions
3. **Pilot Ship** → Navigate 3D space environment to asteroid fields and mining sites
4. **Complete Missions** → Earn XP, unlock traits, and advance consortium rank on-chain
5. **Consortium Governance** → Vote on new sector discoveries, mining regulations, and resource allocation

## 🚀 Key Features

### Honeycomb Protocol Integration
- **On-Chain Missions**: Daily mining quotas, exploration challenges, convoy protection
- **Programmable Traits**: Ship handling proficiency, mining efficiency, leadership capabilities
- **Persistent Progression**: Miner → Foreman → Sector Chief → Board Member ranks
- **Verifiable Achievements**: All progress tracked permanently on Solana blockchain

### 3D Gameplay
- **Immersive Space Environment**: Navigate through asteroid fields and space stations
- **Ship Piloting**: First-person ship controls with physics-based movement
- **Mining Mechanics**: Interactive asteroid mining with visual feedback
- **Dynamic Universe**: Procedurally generated asteroid fields and mining opportunities

### DAO Mechanics
- **Consortium Voting**: Community decisions affect game world and available missions
- **Resource Allocation**: Collective decisions on sector development and exploration
- **Cross-Guild Cooperation**: Form alliances and joint ventures with other players

## 🛠 Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **3D Graphics**: React Three Fiber + Three.js + Drei
- **Blockchain**: Solana Web3.js + SPL Token
- **Wallet Integration**: Solana Wallet Adapter
- **On-Chain Progression**: Honeycomb Protocol Edge Client
- **Styling**: Tailwind CSS 4.1

## 📁 Project Structure

```
starstrike/
├── app/                          # Next.js app directory
│   ├── components/              # React components
│   │   ├── game/               # Game-specific components
│   │   ├── ui/                 # UI components
│   │   └── wallet/             # Wallet connection components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   ├── honeycomb/         # Honeycomb Protocol integration
│   │   ├── solana/            # Solana blockchain utilities
│   │   └── three/             # Three.js utilities
│   ├── types/                  # TypeScript type definitions
│   └── globals.css            # Global styles
├── docs/                       # Documentation
├── public/                     # Static assets
├── .env.local                 # Environment variables
└── package.json               # Dependencies
```

## 🎯 Development Roadmap

### Phase 1: Foundation (Week 1)
- [x] Project setup with Next.js and dependencies
- [ ] Wallet connection integration
- [ ] Basic 3D scene with React Three Fiber
- [ ] Honeycomb Protocol client setup

### Phase 2: Core Gameplay (Week 2)
- [ ] 3D space station environment
- [ ] Ship piloting mechanics
- [ ] Basic asteroid mining interaction
- [ ] Mission system integration with Honeycomb

### Phase 3: Progression System (Week 3)
- [ ] On-chain trait assignment
- [ ] XP and ranking system
- [ ] Mission completion rewards
- [ ] Progress visualization

### Phase 4: Consortium Features (Week 4)
- [ ] DAO voting mechanics
- [ ] Multi-player coordination
- [ ] Advanced mission types
- [ ] Leaderboards and achievements

### Phase 5: Polish & Deployment
- [ ] UI/UX improvements
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Mainnet deployment

## 🏆 Honeycomb Bounty Requirements

### ✅ Required Features
- **Missions/Quests**: Daily mining quotas, exploration challenges
- **Trait Assignment**: Ship handling, mining efficiency, leadership skills
- **On-Chain Progression**: Persistent XP and ranking system
- **Public Repository**: Available on GitHub with documentation
- **Video Walkthrough**: 3-minute demonstration (planned)
- **Working Prototype**: Devnet deployment target

### 🎨 Creative Implementation
- **3D Interactive Environment**: Immersive space mining experience
- **DAO Integration**: Community-driven consortium decisions
- **Cross-Platform Progression**: Traits and achievements portable across dApps
- **Real-time Multiplayer**: Cooperative missions and competition

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Solana CLI (for blockchain interaction)
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/starstrike.git
cd starstrike

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables
```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Honeycomb Protocol
NEXT_PUBLIC_HONEYCOMB_PROGRAM_ID=your_program_id
HONEYCOMB_SECRET_KEY=your_secret_key

# Game Configuration
NEXT_PUBLIC_GAME_VERSION=0.1.0
```

## 📊 Game Mechanics

### Mission Types
1. **Mining Quotas**: Extract specific amounts of resources from asteroid fields
2. **Exploration**: Discover new sectors and map uncharted territories
3. **Convoy Protection**: Escort mining ships through dangerous sectors
4. **Salvage Operations**: Recover valuable materials from derelict ships

### Trait System
- **Ship Handling**: Improves maneuverability and flight efficiency
- **Mining Efficiency**: Increases resource extraction rates
- **Leadership**: Unlocks advanced missions and consortium privileges
- **Navigation**: Enables access to distant sectors and rare asteroids

### Progression Ranks
1. **Rookie Miner**: Basic missions and local asteroid access
2. **Experienced Pilot**: Intermediate missions and sector exploration
3. **Mining Foreman**: Lead team missions and vote on sector policies
4. **Sector Chief**: Access to rare resources and advanced territories
5. **Board Member**: Full consortium voting rights and exclusive missions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details.

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Document all public APIs
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [./docs/](./docs/)
- **Honeycomb Protocol**: https://honeycomb.hxro.com/
- **Solana**: https://solana.com/

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Join our Discord community [Link TBD]
- Follow development updates on Twitter [Handle TBD]

---

**Built for the Honeycomb Protocol Bounty** | **Powered by Solana Blockchain**
