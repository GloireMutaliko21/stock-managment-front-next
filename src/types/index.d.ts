type Session = {
  isLoggedIn: boolean;
  jwt: string;
  user?: User;
};

interface Role {
  id: string;
  designation: string;
  description?: string;
  promotion: Promotion;
}

interface Promotion {
  id: string;
  description: string;
  schoolYear: string;
}

type AccountStatus = 'ACTIVE' | 'DELETED' | 'PENDING' | 'DISABLED';

interface User {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: File;
  firstName: string;
  lastName: string;
  email: string;
  status: AccountStatus;
  role: 'ADMIN' | 'SELLER' | 'SUPER_ADMIN';
}

type DocStatus = 'COMPLETED' | 'NOT_COMPLETED';

type Student = {
  id: string;
  user: User;
  amount: number;
  solvency: number;
  matricule: string;
  docStatus: DocStatus;
  dateOfBirth: Date;
  tutor: string;
  submissionDate: Date;
  submissionStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  faculty: Faculty;
  level: Level;
  classroom?: Classroom;
};

interface AccountInfos {
  dateOfBirth: Date | string;
  email: string;
  sex: 'M' | 'F';
  phone: string;
  tutor: string;
  academicRecord: number;
}

interface AcademicInfos {
  level: string;
  faculty: string;
  firstName: string;
  lastName: string;
  docStatus: DocStatus;
}

interface Faculty {
  id: string;
  designation: string;
  description: string;
  promotion: Promotion;
  levels: Level[];
}

interface Level {
  id: string;
  designation: string;
  description: string;
  faculty: Faculty;
}

interface Submission {
  id: string;
  criteria: string;
  level: Level;
  faculty: Faculty;
}

interface File {
  id: string;
  name: string;
  width?: number;
  height?: number;
  size: number;
  mime: string;
  url: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Classroom {
  id: string;
  designation: string;
  description: string;
}

interface Subject {
  id: string;
  promotion: Promotion;
  faculty: Faculty;
  level: Level;
  designation: string;
  weighing: number;
  hoursNumber: number;
  teacher: Teacher;
}

interface Request {
  id: string;
  student: Student;
  academicRecord: File;
  score: number;
}

type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

type HttpRequestStatus = 'idle' | 'success' | 'pending' | 'failed';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  createdAt?: Date;
  name: string;
  description: string;
  purchasedPrice: number;
  sellingPrice: number;
  category: Category;
  stock: number;
}
interface MyProduct {
  id: string;
  product: Product;
  stock: number;
}

interface Provide {
  id: string;
  createdAt;
  product: Product;
  description: string;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  provider: User;
  recipient: User;
}

interface Sale {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: string;
  factureId: string;
  facture: {
    id: string;
    createdAt: string;
    updatedAt: string;
    reference: string;
    clientName?: string;
    clientPhone?: string;
    description?: string;
    amountPaid: number;
    amountDue: number;
    totalAmount: number;
    products: Product[];
  };
  seller: {
    id: string;
    createdAt: string;
    updatedAt: string;
    fileId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: string;
    role: string;
  };
}

interface Supplie {
  id: string;
  name: string;
  tel: string;
  createdAt: string;
  updatedAt: string;
}
