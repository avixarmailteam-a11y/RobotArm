import { create } from 'zustand'

export interface JointAngles {
  baseRotation: number      // -180 to 180
  shoulderPitch: number     // -90 to 90
  elbowPitch: number        // -135 to 0
  wristPitch: number        // -90 to 90
  wristRoll: number         // -180 to 180
  gripperOpen: number       // 0 to 100 (0=closed, 100=fully open)
}

export interface RobotState {
  joints: JointAngles
  setJoint: (joint: keyof JointAngles, value: number) => void
  resetJoints: () => void
  setJoints: (joints: Partial<JointAngles>) => void

  // AI assistant
  aiMessages: AiMessage[]
  addAiMessage: (message: AiMessage) => void
  isAiThinking: boolean
  setIsAiThinking: (v: boolean) => void

  // Preset positions
  presets: { name: string; joints: Partial<JointAngles> }[]
  applyPreset: (name: string) => void

  // Animation
  isAnimating: boolean
  setIsAnimating: (v: boolean) => void
  targetJoints: JointAngles | null
  setTargetJoints: (joints: JointAngles | null) => void

  // Speed
  speed: number
  setSpeed: (v: number) => void
}

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const defaultJoints: JointAngles = {
  baseRotation: 0,
  shoulderPitch: 0,
  elbowPitch: -45,
  wristPitch: 0,
  wristRoll: 0,
  gripperOpen: 50,
}

const presets = [
  {
    name: 'Ana Konum',
    joints: { baseRotation: 0, shoulderPitch: 0, elbowPitch: -45, wristPitch: 0, wristRoll: 0, gripperOpen: 50 },
  },
  {
    name: 'Tam Açık',
    joints: { baseRotation: 0, shoulderPitch: -45, elbowPitch: -10, wristPitch: 30, wristRoll: 0, gripperOpen: 100 },
  },
  {
    name: 'Tam Kapalı',
    joints: { baseRotation: 0, shoulderPitch: 0, elbowPitch: -90, wristPitch: 0, wristRoll: 0, gripperOpen: 0 },
  },
  {
    name: 'Yukarı Kalk',
    joints: { baseRotation: 0, shoulderPitch: -70, elbowPitch: -20, wristPitch: 45, wristRoll: 0, gripperOpen: 80 },
  },
  {
    name: 'Sağa Dön',
    joints: { baseRotation: 90, shoulderPitch: -30, elbowPitch: -60, wristPitch: 15, wristRoll: 0, gripperOpen: 50 },
  },
  {
    name: 'Sola Dön',
    joints: { baseRotation: -90, shoulderPitch: -30, elbowPitch: -60, wristPitch: 15, wristRoll: 0, gripperOpen: 50 },
  },
  {
    name: 'Alçak Tutuş',
    joints: { baseRotation: 0, shoulderPitch: 15, elbowPitch: -120, wristPitch: -30, wristRoll: 0, gripperOpen: 30 },
  },
]

export const useRobotStore = create<RobotState>((set, get) => ({
  joints: { ...defaultJoints },
  setJoint: (joint, value) =>
    set((state) => ({
      joints: { ...state.joints, [joint]: value },
    })),
  resetJoints: () => set({ joints: { ...defaultJoints } }),
  setJoints: (joints) =>
    set((state) => ({
      joints: { ...state.joints, ...joints },
    })),

  aiMessages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Merhaba! Ben robot kol asistanınızım. Size hareket önerileri verebilir, pozisyonları planlayabilir ve sorularınızı yanıtlayabilirim. Nasıl yardımcı olabilirim?',
      timestamp: Date.now(),
    },
  ],
  addAiMessage: (message) =>
    set((state) => ({
      aiMessages: [...state.aiMessages, message],
    })),
  isAiThinking: false,
  setIsAiThinking: (v) => set({ isAiThinking: v }),

  presets,
  applyPreset: (name) => {
    const preset = get().presets.find((p) => p.name === name)
    if (preset) {
      set({ joints: { ...get().joints, ...preset.joints } })
    }
  },

  isAnimating: false,
  setIsAnimating: (v) => set({ isAnimating: v }),
  targetJoints: null,
  setTargetJoints: (joints) => set({ targetJoints: joints }),

  speed: 2,
  setSpeed: (v) => set({ speed: v }),
}))
