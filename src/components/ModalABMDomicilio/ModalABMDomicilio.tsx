import { Button, Form, Modal, Table } from "react-bootstrap";

//Dependencias para validar los formularios
import * as Yup from "yup";
import { useFormik } from "formik";


//Notificaciones al usuario
import { toast } from 'react-toastify';


import { ModalType } from "../../types/ModalType";
import { Domicilio } from "../../types/Domicilio";
import { DomicilioService } from "../../services/DomicilioService";



//Recibe parametros como props para que se renderice, su titulo y según qué operación queremos realizar.
type ModalABMDomicilioProps = {
    show: boolean;
    onHide: () => void;
    calle: string;
    modalType: ModalType;
    domi: Domicilio;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
  };


const ModalABMDomicilio = ({show, onHide, calle, domi,modalType,refreshData}:ModalABMDomicilioProps) => {

  //CREATE-UPDATE función handleSaveUpdate 

  const handleSaveUpdate = async (domi : Domicilio) => {
    try {
      const isNew = domi.id === 0;
      if (isNew) {
        await DomicilioService.createDomicilio(domi);
      } else {
        await DomicilioService.updateDomicilio(domi.id, domi)
        
      }

      toast.success(isNew ? "Domicilio creada" : "Domicilio actualizada", {
        position: "top-center"
      });
      onHide();
      refreshData(prevState => !prevState);
    } catch (error) {
      console.error(error);
      toast.error('Ha ocurrido un error');
      
    }

  };



//Función handleDelete (DELETE)
const handleDelete = async () => {
  try {
    await DomicilioService.deleteDomicilio(domi.id);
     
      toast.success("domicilio borrado", {
          position: "top-center",
      });
      onHide();
      refreshData(prevState => !prevState);
  } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
      
  }
  
}


   //YUP - Esquema de validación
         const validationSchema = () => {
          return Yup.object().shape({
            id: Yup.number().required('Este campo es obligatorio'),
           calle: Yup.string().required('Este campo es obligatorio'),
           numero: Yup.number().required('Este campo es obligatorio'),
           codigoPostal: Yup.number().required('Este campo es obligatorio'),
           localidad: Yup.string().required('Este campo es requerido')  
          });
      };

    const formik = useFormik({
      initialValues: domi,
      validationSchema: validationSchema(),
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: (obj: Domicilio) => handleSaveUpdate(obj),
    });


  return (
  <>
  
  { modalType === ModalType.DELETE ? (
    <>

      <Modal show={show} onHide={onHide} centered backdrop="static">

      <Modal.Header closeButton>
        <Modal.Title>{calle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p> ¿Está seguro que desea eliminar el producto  
            <br /> <strong> {domi.calle} </strong> ?
        </p>
      </Modal.Body>

      <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
              Cancelar
          </Button>

          <Button variant="danger" onClick={handleDelete}>
              Borrar
          </Button>
      </Modal.Footer>

      </Modal>

    </>
            ) : ( 

              <>
              
              
              <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{calle}</Modal.Title>
      </Modal.Header>


      <Modal.Body>

        <Form onSubmit={formik.handleSubmit}>
          <Table striped bordered hover>
            <thead>
              <tr>
               
                <th>Calle</th>
                <th>Numero</th>
                <th>CodigoPostal</th>
                <th>Localidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    name="calle"
                    value={formik.values.calle}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.calle && !!formik.errors.calle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.calle}</Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="numero"
                    value={formik.values.numero}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.numero && !!formik.errors.numero}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.numero}</Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="codigoPostal"
                    value={formik.values.codigoPostal}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.codigoPostal && !!formik.errors.codigoPostal}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.codigoPostal}</Form.Control.Feedback>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="localidad"
                    value={formik.values.localidad}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.localidad && !!formik.errors.localidad}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.localidad}</Form.Control.Feedback>
                </td>
                
              </tr>
            </tbody>
          </Table>
          <Button type="submit">Agregar</Button>
        </Form>
      </Modal.Body>
              
              </Modal>
              </>


  )}

</>
  
  )



}

export default ModalABMDomicilio;