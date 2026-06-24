export type TrailStatus = 'locked' | 'unlocked' | 'completed';

export interface TrailNode {
  id: string;
  title: string;
  slug: string;
  status: TrailStatus;
  colorClass: string;       
  accentColorClass: string; 
  glowClass: string;        
  icon: string;
}