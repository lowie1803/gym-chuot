import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";

export default function Messenger({ selectedStudent, setSelectedStudent, workoutSent, messages, sendMessage, setActiveTab }) {
  return (
    <>
      <ConversationList
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        workoutSent={workoutSent}
      />
      <ChatArea
        selectedStudent={selectedStudent}
        messages={messages}
        sendMessage={sendMessage}
        setActiveTab={setActiveTab}
      />
    </>
  );
}
