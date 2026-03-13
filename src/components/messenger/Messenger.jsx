import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";

export default function Messenger({ selectedStudent, setSelectedStudent, previews, messages, sendMessage, setActiveTab, students, currentUserId }) {
  return (
    <>
      <ConversationList
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        previews={previews}
        currentUserId={currentUserId}
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
