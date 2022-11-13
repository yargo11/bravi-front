import {
  Flex, Heading, Box, Text, Input, Button, Link, VStack,
} from '@chakra-ui/react'

import { useEffect, useRef, useState } from 'react'
import { apiUrl } from './api/api'

export interface meusContatos {
  contatos: Array<ContatoProps>
}

type ContatoProps = {
  id: string
  name: string
  contatos?: Array<RedesT>
}

type RedesT = {
  redeNome: string
  link: string
}

export default function Home() {

  const [lista, setLista] = useState<ContatoProps[]>([])

  const [novoNome, setNovoNome] = useState<string>()

  const [inputList, setInputList] = useState([{ redeNome: "", link: "" }]);

  useEffect(() => {
    apiUrl.get(`/`).then(response => setLista(response.data))
  }, [])

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, { redeNome: "", link: "" }]);
  };

  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  function deleteContato(id: string) {
    apiUrl.delete(`/${id}`).then(res => apiUrl.get(`/`).then(response => setLista(response.data)))
  }

  async function addContato() {
    await apiUrl.post(`/`, {
      name: novoNome,
      contatos: inputList
    }).then(response => response.data)
    await apiUrl.get(`/`).then(response => setLista(response.data))
  }

  return (
    <Flex
      maxW="1320px" w="100%"
      mx="auto" p="1rem"
      flexDir="column"
      rowGap="10px"
      bg="gray.800"
    >
      <Heading>Lista de contatos</Heading>
      <Flex flexDir="column" gap="8px">
        <Text fontSize="1.5rem"> Adicionar novo contato</Text>
        <Input isRequired placeholder='Nome' name="nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />

        {inputList.map((x, i) => {
          return (
            <Flex gap="8px" key={i}>
              <Input placeholder='Rede' name="redeNome" value={x.redeNome} onChange={e => handleInputChange(e, i)} />
              <Input placeholder='Link' name="link" value={x.link} onChange={e => handleInputChange(e, i)} />

              <Flex columnGap="8px">
                {inputList.length !== 1 && <Button onClick={handleRemoveClick} colorScheme="red" >Remover Rede</Button>}
                {inputList.length - 1 === i && <Button onClick={handleAddClick} colorScheme="blue" >Nova Rede</Button>}
              </Flex>
            </Flex>
          );
        })}

        <Button onClick={addContato} colorScheme="green">Adicionar</Button>

      </Flex>
      <VStack gap="0.5rem" align="start" mt="1rem">
        {lista.map(contato => (
          <Flex flexDir="column" p="1rem" bg="gray.700" borderRadius="6px" key={contato.id}>
            <Text fontSize="1.5rem" fontWeight="600" mb="1rem">
              {contato.name}
            </Text>
            <small>{contato.id}</small>
            <Box mb="0.1rem">
              {contato.contatos?.map(rede => (
                <Text key={rede.redeNome} fontSize="1.25rem" fontWeight="500">{rede.redeNome}:
                  <Link href="/">{rede.link}</Link>
                </Text>
              ))}
            </Box>
            <Button variant="link" as={Link} href={`/update/${contato.id}`} colorScheme="yellow" mt="1rem">Atualizar</Button>
            <Button onClick={() => deleteContato(contato.id)} colorScheme="red" mt="1rem">Deletar</Button>
          </Flex>
        ))}

      </VStack>

    </Flex >
  )
}

