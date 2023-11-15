import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

import { ModalType } from "../../types/ModalType";

import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import { Domicilio } from "../../types/Domicilio";
import { DomicilioService } from "../../services/DomicilioService";
import Loader from "../Loader/Loader";
import ModalABMDomicilio from "../ModalABMDomicilio/ModalABMDomicilio";


const ABMUnidadMedida = () => {

  //Variable que va a contener los datos recibidos por la API
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);

  //Variable que muestra el componente Loader hasta que se reciban los datos de la API
  const [isLoading, setIsLoading] = useState(true);

  //Variable que va actualizar los datos de la tabla luego de cada operacion exitosa
  const [refreshData, setRefreshData] = useState(false);


  //Este hook se va a ejecutar cada vez que se renderice el componente o refreshData cambie de estado
  useEffect(() => {

    //Llamamos a la función para obtener todos los productos declarado en el service
    const fetchDomicilios = async () => {
      const domicilios = await DomicilioService.getAllDomicilios();
      setDomicilios(domicilios);
      setIsLoading(false);
    };

    fetchDomicilios();
  }, [refreshData]);


  //Test, este log está modificado para que muestre los datos de una manera más legible
  console.log(JSON.stringify(domicilios, null, 2));


  //Se inicializa una unidad medida vacia cuando vayamos a crear uno nuevo, para evitar "undefined"
  const initializeNewDomicilio = (): Domicilio => {
    return {
      id: 0,
      calle: '',
      numero: 0,
      codigoPostal: 0,
      localidad: '',
    };
  };


  //Producto seleccionado que se va a pasar como prop al Modal
  const [Domicilio, setDomicilio] = useState<Domicilio>(initializeNewDomicilio);

  //Manejo de Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [calle, setCalle] = useState("");

  //Logica de Modal
  const handleClick = (newCalle: string, domi: Domicilio, modal: ModalType) => {
    setCalle(newCalle);
    setModalType(modal);
    setDomicilio(domi);
    setShowModal(true);

  };





  return (

    <>
      <div className="m-3">

        {/* Botón para que cuando el usuario haga click llame a la función que declaramos */}
        <Button onClick={() => handleClick("Nueva domicilio",
          initializeNewDomicilio(), ModalType.CREATE)}>
          Nuevo domicilio
        </Button>

        {isLoading ? <Loader /> : (

          <Table>
            <thead>
              <tr>
                <th> ID </th>
                <th> NOMBRE CALLE </th>
                <th> NUMERO </th>
                <th> CODIGO POSTAL </th>
                <th> LOCALIDAD </th>
                <th> ACCIONES </th>
              </tr>
            </thead>

            <tbody>
              {domicilios.map((domicilio) => (
                <tr key={domicilio.id}>
                  <td>{domicilio.id}</td>
                  <td>{domicilio.calle}</td>
                  <td>{domicilio.numero}</td>
                  <td>{domicilio.codigoPostal}</td>
                  <td>{domicilio.localidad}</td>


                  <td> <EditButton onClick={() => handleClick("Editar unidad medida", Domicilio, ModalType.UPDATE)} /> </td>
                  <td> <DeleteButton onClick={() => handleClick("Borrar unidad medida", Domicilio, ModalType.DELETE)} /> </td>

                </tr>
              ))}
            </tbody>

          </Table>

        )}

        {showModal && (
          <ModalABMDomicilio
            show={showModal}
            onHide={() => setShowModal(false)}
            calle={calle}
            modalType={modalType}
            domi={Domicilio}
            refreshData={setRefreshData}
          />

        )}


      </div>

    </>
  )
}


export default ABMUnidadMedida;