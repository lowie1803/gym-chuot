import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";

export default function Messenger({ selectedStudent, setSelectedStudent, workoutSent, messages, sendMessage, setActiveTab, students, currentUserId }) {
  return (
    <>
      <ConversationList
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        workoutSent={workoutSent}
        students={students}
      />
      <ChatArea
        selectedStudent={selectedStudent}
        messages={messages}
        sendMessage={sendMessage}
        setActiveTab={setActiveTab}
        currentUserId={currentUserId}
      />
    </>
  );
}
