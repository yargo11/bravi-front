import {
  Flex, Heading, Text, Input, Button, Link, VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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

  const [tempId, setTempId] = useState<string>()
  const [tempName, setTempName] = useState<string>()
  const [tempRedes, setTempRedes] = useState<RedesT[]>([])

  const [suportes, setSuportes] = useState<string>('')

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    apiUrl.get(`/`).then(response => setLista(response.data))
  }, [])


  function validarSuportes() {

    const suporteArray = suportes.split('')
    console.log('Fora do For', suporteArray)

    let aux = suporteArray.length
    let aux2 = suporteArray.length

    while (aux > 0) {
      for (let i = 0; i <= suporteArray.length; i++) {
        if (
          suporteArray.length > 0 &&
          (
            (suporteArray[i] === '{' && suporteArray[i + 1] === '}') ||
            (suporteArray[i] === '[' && suporteArray[i + 1] === ']') ||
            (suporteArray[i] === '(' && suporteArray[i + 1] === ')')
          )
        ) {
          suporteArray.splice(i, 2)
          console.log('Dentro do For', suporteArray)
          setSuportes(suporteArray.join(''))

        }

        else if (suporteArray.length === 0) {
          alert("Sequência Válida")
          return console.log("Sucesso")
        }
      }

      aux--

      if (aux2 === suporteArray.length) {
        alert("Sequência Inválida")
        return console.log("ERROU")
      }

      aux2 = suporteArray.length
    }


  }

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

  const handleAddClickTemp = () => {
    setTempRedes([...tempRedes, { redeNome: "", link: "" }]);
  };

  const handleRemoveClickTemp = (index: number) => {
    const list = [...tempRedes];
    list.splice(index, 1);
    setTempRedes(list);
  };

  const handleInputChangeTemp = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const list = [...tempRedes];
    list[index][name] = value;
    setTempRedes(list);
  };

  function deleteContato(id: string) {
    apiUrl.delete(`/${id}`).then(res => apiUrl.get(`/`).then(response => setLista(response.data)))
  }

  async function addContato() {
    await apiUrl.post(`/`, {
      name: novoNome,
      contatos: inputList
    }).then(response => response.data)
    await apiUrl.get(`/`).then(response => {
      setLista(response.data)
      setNovoNome('')
      setInputList([{ redeNome: "", link: "" }])
    })

    setNovoNome('')
    setInputList([{ redeNome: "", link: "" }])
  }

  function tempContato(id: string) {
    apiUrl.get(`/?id=${id}`).then(response => {
      setTempName(response.data[0].name),
        setTempRedes(response.data[0].contatos),
        setTempId(response.data[0].id)
    })
    onOpen()
  }

  async function updateContato(id: string | undefined) {
    await apiUrl.put(`/${id}`, {
      name: tempName,
      contatos: tempRedes
    }).then(response => response.data)
    await apiUrl.get(`/`).then(response => {
      setLista(response.data)
      setNovoNome('')
      setInputList([{ redeNome: "", link: "" }])
    })
    onClose()
  }

  return (
    <Flex
      maxW="1320px" w="100%"
      mx="auto" p="1rem"
      flexDir="column"
      rowGap="10px"
      bg="gray.800"
    >
      <Heading>Suportes Balanceados</Heading>
      <Input placeholder='{[()]}' name="suportes" value={suportes} onChange={(e) => setSuportes(e.target.value)} />
      <Button colorScheme="teal" onClick={validarSuportes}>Validar</Button>
      <Heading>Lista de contatos</Heading>
      <Flex flexDir="column" gap="8px">
        <Text fontSize="1.5rem"> Adicionar novo contato</Text>
        <Input placeholder='Nome' name="nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />

        {inputList.map((x, i) => {
          return (
            <Flex gap="8px" key={i}>
              <Input placeholder='Rede' name="redeNome" value={x.redeNome} onChange={e => handleInputChange(e, i)} />
              <Input placeholder='Link' name="link" value={x.link} onChange={e => handleInputChange(e, i)} />

              <Flex columnGap="8px">
                {inputList.length !== 1 && <Button onClick={() => handleRemoveClick(i)} colorScheme="red" >Remover Rede</Button>}
                {inputList.length - 1 === i && <Button onClick={handleAddClick} colorScheme="blue" >Nova Rede</Button>}
              </Flex>
            </Flex>
          );
        })}

        <Button onClick={addContato} colorScheme="green">Adicionar</Button>

      </Flex>
      <VStack gap="0.5rem" align="start" mt="1rem">
        {lista.map(contato => (
          <Flex flexDir="column" p="1rem" bg="gray.700" borderRadius="6px" key={contato.id} align="center">
            <Text fontSize="1.5rem" fontWeight="600" mb="1rem">
              {contato.name}
            </Text>
            <small>{contato.id}</small>
            <VStack mb="0.1rem" >
              {contato.contatos?.map(rede => (
                <Link key={rede.redeNome} fontSize="1.25rem" fontWeight="500" href={rede.link}>{rede.redeNome}</Link>
              ))}
            </VStack>
            {/* href={`/update/${contato.id}`} */}
            <Button variant="link" onClick={() => tempContato(contato.id)} colorScheme="yellow" mt="1rem">Atualizar</Button>
            <Button onClick={() => deleteContato(contato.id)} colorScheme="red" mt="1rem">Deletar</Button>
          </Flex>
        ))}

      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent width="100%" maxW="900px">
          <ModalHeader>{tempId}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder='Nome' name="nome" value={tempName} onChange={(e) => setTempName(e.target.value)} />

            {tempRedes.map((x, i) => {
              return (
                <Flex gap="8px" key={i}>
                  <Input placeholder='Rede' name="redeNome" value={x.redeNome} onChange={e => handleInputChangeTemp(e, i)} />
                  <Input placeholder='Link' name="link" value={x.link} onChange={e => handleInputChangeTemp(e, i)} />

                  <Flex columnGap="8px">
                    {tempRedes.length !== 1 && <Button onClick={() => handleRemoveClickTemp(i)} colorScheme="red" >Remover Rede</Button>}
                    {tempRedes.length - 1 === i && <Button onClick={handleAddClickTemp} colorScheme="blue" >Nova Rede</Button>}
                  </Flex>
                </Flex>
              );
            })}
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button colorScheme='yellow' onClick={() => updateContato(tempId)}>Atualizar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex >
  )
}

