export interface Task {
  id: number;
  
  taskName: string;
  assigneeId: number;
  projectId: number;
  asginDate: string;
  dueDate: string;
  priority: string;
  progress: string;
  status: string;
}
export interface Project {
  description: string;
  id: number;
  projectName: string;
  img: string;
  projectDescription:string
  members: Member[];
  task: Task[];
}
export interface Member {
  userId: number;
  fullName: string;
  role: string;
}
export interface User {
    id:number,
    fullName:string,
    email:string,
    password:string
}