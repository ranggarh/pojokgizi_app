import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Text, Button, Icon, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, CloseIcon } from "@gluestack-ui/themed";

const InfoPopover = ({ title, message }: { title: string; message: string }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Tombol Trigger */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Box bg="$blue600" px="$4" py="$2" borderRadius="$md">
          <Text size="sm" color="$white">Add Employee</Text>
        </Box>
      </TouchableOpacity>

      {/* Modal Popover */}
      <Modal isOpen={visible} onClose={() => setVisible(false)} size="md">
        <ModalBackdrop />
        <ModalContent bg="$blue600" borderRadius="$md">
          {/* Header */}
          <ModalHeader flexDirection="row" justifyContent="space-between">
            <Text size="md" color="$white" fontWeight="bold">{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <CloseIcon color="$white" />
            </TouchableOpacity>
          </ModalHeader>

          {/* Body */}
          <ModalBody>
            <Text size="sm" color="$white">{message}</Text>
          </ModalBody>

          {/* Footer */}
          <ModalFooter>
            <Button bg="$white" onPress={() => setVisible(false)}>
              <Text color="$blue600">Got It</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InfoPopover;
