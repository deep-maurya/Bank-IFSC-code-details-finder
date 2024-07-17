import React, { useState } from 'react';
import axios from 'axios';
import 'animate.css';
import {
  Container,
  SimpleGrid,
  Flex,
  Text,
  Stack,
  StackDivider,
  Input,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const Feature = ({ text, text_label }) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Text fontSize={'lg'} fontWeight={600}>
        <Text fontSize={'sm'} fontWeight={800}>{text_label}</Text>
        {text}
      </Text>
    </Stack>
  );
};

const validateIFSCCode = (code) => {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(code);
};

export default function IFSC_search() {
  const [ifscCode, setIFSCCode] = useState('');
  const [isValidIFSC, setIsValidIFSC] = useState(true);
  const [bankDetails, setBankDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleIFSCChange = (e) => {
    setIFSCCode(e.target.value.toUpperCase());
    setIsValidIFSC(true);
    setError(null);
  };

  const fetchIFSCDetails = async () => {
    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifscCode}`);
      setBankDetails(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateIFSCCode(ifscCode)) {
      fetchIFSCDetails();
    } else {
      setIsValidIFSC(false);
      setBankDetails(null);
    }
  };

  return (
    <Container maxW={'5xl'} py={12}>
      <Text
        textTransform={'uppercase'}
        color={'blue.400'}
        fontWeight={600}
        fontSize={'sm'}
        textAlign={'center'}
        bg={useColorModeValue('blue.50', 'blue.900')}
        p={5}
        alignSelf={'flex-start'}
        rounded={'md'}>
        IFSC Code Details Finder
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} mt={10} spacing={10}>
        <Flex>
          <form onSubmit={handleSubmit}>
            <Text as={'b'} fontSize='lg'>Enter IFSC Code</Text>
            <Input
              type="text"
              placeholder={'Enter IFSC code here..'}
              size={'lg'}
              value={ifscCode}
              onChange={handleIFSCChange}
            />
            {!isValidIFSC && <Text color="red.500">Invalid IFSC code format. Please enter a valid IFSC code.</Text>}
            <Button mt={3} colorScheme='teal' size='lg' type="submit">Fetch Details</Button>
          </form>
        </Flex>
        <Stack spacing={4}>
          {bankDetails && !error && (
            <Stack
              spacing={4}
              divider={
                <StackDivider borderColor={useColorModeValue('gray.100', 'gray.700')} />
              }>
              <Feature text={bankDetails.BANK} text_label={'Bank Name'} />
              <Feature text={bankDetails.BRANCH} text_label={'Branch'} />
              <Feature text={bankDetails.ADDRESS} text_label={'Address'} />
              <Feature text={bankDetails.CONTACT} text_label={'Contact'} />
              <Feature text={bankDetails.MICR != null ? bankDetails.MICR : "N/A"} text_label={'MICR'} />
            </Stack>
          )}
          {error && <Text color="red.500">Error: {error}</Text>}
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
