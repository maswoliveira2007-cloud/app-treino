/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  Activity, 
  Zap,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Tipagens ---
interface Exercise {
  name: string;
  sets: number;
  note?: string;
}

interface WorkoutDay {
  id: string;
  title: string;
  day: string;
  exercises: Exercise[];
  note?: string;
}

// --- Dados do Treino ---
const WORKOUT_DATA: WorkoutDay[] = [
  {
    id: 'a1',
    title: 'Treino A1 - Quadríceps & Abdômen',
    day: 'Segunda-feira',
    note: 'Estímulo em posterior',
    exercises: [
      { name: 'Cadeira Extensora', sets: 3, note: 'Inclui aquecimento (foco em cadência)' },
      { name: 'Agachamento no Smith', sets: 3 },
      { name: 'Leg Press 45º', sets: 3 },
      { name: 'Cadeira Flexora', sets: 2 },
      { name: 'Panturrilha no Leg Press 180º', sets: 2 },
      { name: 'Panturrilha Sentado', sets: 2 },
      { name: 'Abdômen na Máquina', sets: 2 },
    ]
  },
  {
    id: 'b1',
    title: 'Treino B1 - Costas e Bíceps',
    day: 'Terça-feira',
    exercises: [
      { name: 'Barra Fixa (Gravitron)', sets: 4, note: '4x10 - Aquecimento' },
      { name: 'Puxada Frontal Pegada Aberta', sets: 3 },
      { name: 'Remada Bilateral na Máquina', sets: 3 },
      { name: 'Puxada Frontal com Triângulo', sets: 3 },
      { name: 'Remada Curvada', sets: 3 },
      { name: 'Rosca Martelo', sets: 2 },
    ]
  },
  {
    id: 'c1',
    title: 'Treino C1 - Posterior & Abdômen',
    day: 'Quarta-feira',
    note: 'Aquecer 5min na bicicleta | Estímulo em quadríceps',
    exercises: [
      { name: 'Cadeira Flexora', sets: 3 },
      { name: 'Mesa Flexora', sets: 3 },
      { name: 'Levantamento Terra Romeno', sets: 3 },
      { name: 'Elevação Pélvica', sets: 3 },
      { name: 'Adutora', sets: 2 },
      { name: 'Cadeira Extensora', sets: 2 },
      { name: 'Abdômen na Máquina', sets: 3 },
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Peito, Ombro e Tríceps',
    day: 'Quinta-feira',
    note: 'Aquecimento na esteira 5min',
    exercises: [
      { name: 'Supino Inclinado com Halteres', sets: 3 },
      { name: 'Crucifixo na Máquina', sets: 3 },
      { name: 'Desenvolvimento na Máquina', sets: 3 },
      { name: 'Elevação Lateral na Polia', sets: 3 },
      { name: 'Extensão de Tríceps na Polia', sets: 3 },
      { name: 'Panturrilha em Pé', sets: 3, note: 'Máquina ou Leg 180º' },
    ]
  },
  {
    id: 'b2',
    title: 'Treino B2 - Costas e Bíceps',
    day: 'Sexta-feira',
    exercises: [
      { name: 'Barra Fixa (Gravitron)', sets: 4, note: '4x10 - Aquecimento' },
      { name: 'Remada Serrote', sets: 3 },
      { name: 'Remada Baixa', sets: 3 },
      { name: 'Puxada Frontal Pegada Supinada', sets: 3 },
      { name: 'Pulldown', sets: 3 },
      { name: 'Rosca Direta com Halteres', sets: 3 },
      { name: 'Fortalecimento Lombar', sets: 2 },
    ]
  },
  {
    id: 'c2',
    title: 'Treino C2 - Perna Completa',
    day: 'Sábado',
    note: 'Refinamentos e volume equilibrado',
    exercises: [
      { name: 'Cadeira Extensora', sets: 3 },
      { name: 'Agachamento no Smith', sets: 3 },
      { name: 'Leg Press 180º', sets: 3 },
      { name: 'Cadeira Flexora', sets: 3 },
      { name: 'Levantamento Terra Romeno', sets: 2 },
      { name: 'Elevação Pélvica', sets: 3 },
      { name: 'Abdutora', sets: 2 },
      { name: 'Adutora', sets: 2 },
    ]
  },
];

// --- Dados de Periodização ---
const PERIODIZATION = [
  { week: 1, reps: '12 - 15', rest: '1min', type: 'base' },
  { week: 2, reps: '10 - 12', rest: '1min 15s', type: 'base' },
  { week: 3, reps: '8 - 10', rest: '1min 30s', type: 'base' },
  { week: 4, reps: '6 - 8', rest: '1min 45s', type: 'base' },
  { week: 5, reps: '4 - 6', rest: '2min', type: 'força', note: 'Séries de 3 para 2' },
  { week: 6, reps: '4 - 6', rest: '1min 45s', type: 'força', note: 'Séries de 3 para 2' },
  { week: 7, reps: '12 - 15', rest: '1min 30s', type: 'recuperação', note: 'Séries de 3 para 2' },
  { week: 8, reps: '8 - 10', rest: '1min 30s', type: 'base' },
  { week: 9, reps: '8 - 10', rest: '1min 30s', type: 'base' },
  { week: 10, reps: '6 - 8', rest: '1min 45s', type: 'base' },
  { week: 11, reps: '6 - 8', rest: '1min 45s', type: 'base' },
  { week: 12, reps: '4 - 6', rest: '2min', type: 'força', note: 'Séries de 3 para 2' },
];

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('a1');

  const currentPeriod = useMemo(() => 
    PERIODIZATION.find(p => p.week === selectedWeek)!, 
  [selectedWeek]);

  const isReducedSets = currentPeriod.type === 'força' || currentPeriod.type === 'recuperação';

  return (
    <div className="min-h-screen bg-surface-900 text-gray-300 pb-20 p-4 md:p-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-2 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-white uppercase leading-none">
              Performance <span className="text-brand font-bold">Protocol</span>
            </h1>
            <p className="text-[10px] sm:text-xs tracking-[0.3em] text-gray-500 uppercase mt-2">
              Planejamento de Periodização Linear • 3 Meses
            </p>
          </div>
          <div className="flex gap-8 w-full md:w-auto">
            <div className="text-right border-r border-white/10 pr-6 flex-1 md:flex-none">
              <p className="text-[10px] uppercase text-gray-500 tracking-widest font-medium">Fase Atual</p>
              <p className="text-sm font-medium text-white mt-1 capitalize whitespace-nowrap">Semana {selectedWeek}: {currentPeriod.type}</p>
            </div>
            <div className="text-right flex-1 md:flex-none">
              <p className="text-[10px] uppercase text-gray-500 tracking-widest font-medium">Meta Global</p>
              <p className="text-sm font-medium text-white mt-1">Hipertrofia & Força</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Weekly Periodization Schedule */}
          <aside className="md:col-span-3 flex flex-col gap-4 sticky top-8">
            <h2 className="text-[11px] font-bold text-brand uppercase tracking-widest">Cronograma 12 Semanas</h2>
            <div className="bg-surface-700 border border-white/5 rounded-2xl p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-1 gap-1.5 max-h-[300px] md:max-h-none overflow-y-auto scrollbar-hide">
              {PERIODIZATION.map((p) => (
                <button
                  key={p.week}
                  onClick={() => setSelectedWeek(p.week)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-[10px] transition-all border ${
                    selectedWeek === p.week
                      ? 'bg-brand/10 border-brand/40 text-brand font-bold'
                      : 'bg-white/5 border-transparent text-gray-500 hover:border-white/10 hover:text-gray-300'
                  }`}
                >
                  <span className={selectedWeek === p.week ? "text-brand" : "text-gray-400"}>S{String(p.week).padStart(2, '0')}</span>
                  <span className="uppercase text-[9px] truncate ml-2 group-hover:block hidden md:block">
                    {p.type === 'força' ? 'Força' : p.reps}
                  </span>
                </button>
              ))}
            </div>
            {currentPeriod.note && (
              <div className="bg-brand/5 p-4 rounded-2xl border border-brand/20">
                <p className="text-[10px] text-brand uppercase font-bold mb-1 flex items-center gap-2">
                  <RotateCcw size={12} />
                  Nota da Fase
                </p>
                <p className="text-[11px] italic leading-tight text-gray-400">{currentPeriod.note}</p>
              </div>
            )}
          </aside>

          {/* Main Content: Today's Workout */}
          <div className="md:col-span-9 flex flex-col gap-6">
            
            {/* Days Navigation */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {WORKOUT_DATA.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => setActiveTab(workout.id)}
                  className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeTab === workout.id
                      ? 'bg-brand text-black border-transparent shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                      : 'bg-surface-600 border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  {workout.id.toUpperCase()} • {workout.day.split('-')[0]}
                </button>
              ))}
            </div>

            {/* Active Workout Detail */}
            <AnimatePresence mode="wait">
              {WORKOUT_DATA.filter(w => w.id === activeTab).map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-surface-800 border border-white/5 rounded-3xl p-6 md:p-8 relative flex flex-col min-h-[500px]"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                    <div>
                      <h3 className="text-3xl font-semibold text-white tracking-tight leading-none">{workout.title.split(' - ')[1]}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-3 font-medium">
                        {workout.note || 'Foco em evolução progressiva'}
                      </p>
                    </div>
                    <div className="flex gap-10">
                      <div className="text-center">
                        <span className="block text-3xl font-medium text-white">{currentPeriod.reps}</span>
                        <span className="text-[10px] uppercase text-brand font-bold tracking-[0.1em] mt-1 block">Repetições</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-3xl font-medium text-white">{currentPeriod.rest}</span>
                        <span className="text-[10px] uppercase text-brand font-bold tracking-[0.1em] mt-1 block">Descanso</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise List */}
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-[10px] text-gray-600 uppercase border-b border-white/5">
                        <tr>
                          <th className="text-left pb-4 font-bold tracking-widest">Exercício</th>
                          <th className="text-center pb-4 font-bold tracking-widest">Séries</th>
                          <th className="text-right pb-4 font-bold tracking-widest hidden sm:table-cell">Notas de Execução</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {workout.exercises.map((exercise, idx) => {
                          const finalSets = (isReducedSets && exercise.sets === 3) ? 2 : exercise.sets;
                          return (
                            <tr key={`${workout.id}-${idx}`} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="py-5">
                                <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-mono text-gray-600 group-hover:text-brand transition-colors">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <span className="font-medium text-white text-sm md:text-base group-hover:translate-x-1 transition-transform">
                                    {exercise.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-5 text-center">
                                <span className={`text-lg font-bold ${finalSets === 2 && isReducedSets ? 'text-brand' : 'text-white'}`}>
                                  {finalSets}x
                                </span>
                              </td>
                              <td className="py-5 text-right hidden sm:table-cell">
                                <span className="text-xs text-gray-500 font-light italic">
                                  {exercise.note || 'Manter técnica estrita'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden rounded-b-3xl">
                    <motion.div 
                      layoutId="progress"
                      className="h-full bg-brand shadow-[0_0_15px_#F97316]"
                      style={{ width: `${(workout.exercises.length / 8) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Summary Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-600 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-2">Esforço Estimado</p>
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-brand" />
                  <p className="text-xl font-bold text-white">RPE 8-9</p>
                </div>
              </div>
              <div className="bg-surface-600 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-2">Tempo Médio</p>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand" />
                  <p className="text-xl font-bold text-white">75 min</p>
                </div>
              </div>
              <div className="bg-surface-600 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-2">Impacto Metabólico</p>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-brand" />
                  <p className="text-xl font-bold text-white">Alto</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWeek(prev => Math.min(12, prev + 1))}
                className="bg-brand rounded-2xl p-5 flex items-center justify-between group cursor-pointer shadow-[0_10px_30px_rgba(249,115,22,0.15)] transition-all hover:scale-[1.02] active:scale-95"
              >
                <span className="text-xs font-black text-black uppercase tracking-widest">Próxima Semana</span>
                <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Control for Weeks */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-surface-800/90 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 shadow-2xl z-50 flex items-center justify-between md:hidden">
        <button 
          onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
          className="p-2 text-gray-400 hover:text-brand transition-colors disabled:opacity-20"
          disabled={selectedWeek === 1}
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <p className="text-[9px] uppercase text-gray-500 font-bold tracking-[0.2em]">Semana</p>
          <p className="font-bold text-white text-sm">{selectedWeek} de 12</p>
        </div>
        <button 
          onClick={() => setSelectedWeek(prev => Math.min(12, prev + 1))}
          className="p-2 text-gray-400 hover:text-brand transition-colors disabled:opacity-20"
          disabled={selectedWeek === 12}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
