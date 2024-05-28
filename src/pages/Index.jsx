import { useState } from "react";
import { Box, Container, VStack, HStack, Text, Input, Textarea, Button, IconButton, SimpleGrid } from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  const handleAddNote = () => {
    if (title && content) {
      const newNote = { id: Date.now(), title, content };
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    }
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find((note) => note.id === id);
    setTitle(noteToEdit.title);
    setContent(noteToEdit.content);
    setIsEditing(true);
    setCurrentNoteId(id);
  };

  const handleUpdateNote = () => {
    setNotes(notes.map((note) => (note.id === currentNoteId ? { ...note, title, content } : note)));
    setTitle("");
    setContent("");
    setIsEditing(false);
    setCurrentNoteId(null);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
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
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Index;