import MessagesPage from '@/components/Dashboard/CareSeeker/Messages';

export type Conversation = {
  id: string;
  name: string;
  preview: string;
  date: string;
  unread?: number;
  avatar: string;
};

export type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
  avatar: string;
};

const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Ujah Emmanuel',
    preview: "Hello doctor, I'm reaching out for…",
    date: '23 April, 2026',
    avatar: '/avatars/1.jpg',
  },
  {
    id: '2',
    name: 'Sara Johnson',
    preview: 'I would like to discuss my recent…',
    date: '15 March, 2026',
    unread: 3,
    avatar: '/avatars/2.jpg',
  },
  {
    id: '3',
    name: 'Liam Thompson',
    preview: 'Can we schedule a follow-up…',
    date: '30 May, 2026',
    unread: 3,
    avatar: '/avatars/3.jpg',
  },
  {
    id: '4',
    name: 'Ava Chen',
    preview: 'I have some questions regarding…',
    date: '12 June, 2026',
    unread: 4,
    avatar: '/avatars/4.jpg',
  },
  {
    id: '5',
    name: 'Noah Williams',
    preview: 'I need assistance with my medi…',
    date: '8 July, 2026',
    unread: 2,
    avatar: '/avatars/5.jpg',
  },
  {
    id: '6',
    name: 'Emma Garcia',
    preview: "I'd like to confirm my next…",
    date: '22 August, 2026',
    unread: 3,
    avatar: '/avatars/6.jpg',
  },
  {
    id: '7',
    name: 'Oliver Martinez',
    preview: 'Please update me on my test results…',
    date: '19 September, 2026',
    unread: 1,
    avatar: '/avatars/7.jpg',
  },
  {
    id: '8',
    name: 'Isabella Rodriguez',
    preview: 'I am feeling much better, thank you!',
    date: '5 October, 2026',
    unread: 2,
    avatar: '/avatars/8.jpg',
  },
];

const messages: Message[] = [
  {
    id: 'm1',
    text: "Hello Dr. Hope you're good? I wanted to bring to your attention that I have a severe rash on my chest",
    time: '11:00 AM',
    fromMe: true,
    avatar: '/avatars/me.jpg',
  },
  {
    id: 'm2',
    text: "How long have you had it? And is there any other symptom you're having?",
    time: '11:03 AM',
    fromMe: false,
    avatar: '/avatars/doctor.jpg',
  },
  {
    id: 'm3',
    text: "Hello Dr. Hope you're good? I wanted to bring to your attention that I have a severe rash on my chest",
    time: '11:00 AM',
    fromMe: true,
    avatar: '/avatars/me.jpg',
  },
  {
    id: 'm4',
    text: "How long have you had it? And is there any other symptom you're having?",
    time: '11:03 AM',
    fromMe: false,
    avatar: '/avatars/doctor.jpg',
  },
];

const page = () => {
  return (
    <div className="m-1 sm:m-5 bg-surface-card rounded-2xl p-2 sm:p-7.5">
      <MessagesPage conversations={conversations} messages={messages} />
    </div>
  );
};

export default page;
