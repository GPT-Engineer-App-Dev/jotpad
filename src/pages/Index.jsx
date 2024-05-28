import { useState, useRef } from "react";
import { Box, Container, VStack, HStack, Text, Input, Textarea, Button, IconButton, SimpleGrid } from "@chakra-ui/react";
import { FaTrash, FaEdit, FaMicrophone, FaPlay } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const handleAddNote = () => {
    if (title && content) {
      const newNote = { id: Date.now(), title, content, image, audioURL };
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
      setImage(null);
      setAudioURL(null);
    }
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find((note) => note.id === id);
    setTitle(noteToEdit.title);
    setContent(noteToEdit.content);
    setImage(noteToEdit.image);
    setAudioURL(noteToEdit.audioURL);
    setIsEditing(true);
    setCurrentNoteId(id);
  };

  const handleUpdateNote = () => {
    setNotes(notes.map((note) => (note.id === currentNoteId ? { ...note, title, content, image, audioURL } : note)));
    setTitle("");
    setContent("");
    setIsEditing(false);
    setCurrentNoteId(null);
    setImage(null);
    setAudioURL(null);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/wav' });
      setAudioURL(URL.createObjectURL(audioBlob));
    };
    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Box as="nav" bg="blue.500" color="white" p={4} mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Note Taking App</Text>
      </Box>
      <VStack spacing={4} mb={4}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <HStack>
          {isRecording ? (
            <Button colorScheme="red" onClick={handleStopRecording}>Stop Recording</Button>
          ) : (
            <Button leftIcon={<FaMicrophone />} colorScheme="blue" onClick={handleStartRecording}>Record Voice Note</Button>
          )}
          {audioURL && <Button leftIcon={<FaPlay />} onClick={() => new Audio(audioURL).play()}>Play Voice Note</Button>}
        </HStack>
        {isEditing ? (
          <Button colorScheme="blue" onClick={handleUpdateNote}>Update Note</Button>
        ) : (
          <Button colorScheme="blue" onClick={handleAddNote}>Add Note</Button>
        )}
      </VStack>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {notes.map((note) => (
          <Box key={note.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
            <HStack justifyContent="space-between" mb={2}>
              <Text fontSize="xl" fontWeight="bold">{note.title}</Text>
              <HStack>
                <IconButton
                  aria-label="Edit"
                  icon={<FaEdit />}
                  size="sm"
                  onClick={() => handleEditNote(note.id)}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FaTrash />}
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                />
              </HStack>
            </HStack>
            <Text>{note.content}</Text>
            {note.image && <Image src={note.image} alt={note.title} mt={2} />}
            {note.audioURL && <Button leftIcon={<FaPlay />} onClick={() => new Audio(note.audioURL).play()}>Play Voice Note</Button>}
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Index;