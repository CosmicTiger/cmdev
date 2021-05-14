import React, {useState, useEffect} from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
import { Modal,TextField, Button, FormControl, NativeSelect, FormHelperText, Grid, Divider} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import "./ClientTable.css";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {  ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InsertClient from './InsertClient';
import EditClient from './EditClient';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const columns = [
    {
        title: 'Codigo del Cliente',
        field: 'sys_code'
    },
    {
        title: 'Primer Nombre',
        field: 'first_name'
    },
    {
        title: 'Primer Apellido',
        field: 'last_name'
    },
    {
        title: 'Cedula',
        field: 'national_id'
    },
    {
        title: 'Telefono',
        field: 'phone'
    }
];

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const baseUrl = "http://localhost:3001/clients";

const useStyles = makeStyles((theme) => ({
    modal: {
      position: 'absolute',
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      margin: 'auto',

      overflowY: 'auto'
    },
    iconos:{
        cursor: 'pointer'
    }, 
    inputMaterial:{
      width: '100%'
    }
  }));


export default function ClientTable(){
    const styles= useStyles();
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState([]);
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalEditar, setModalEditar]= useState(false);
    const [modalEliminar, setModalEliminar]= useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [clientSeleccionado, setClientSeleccionado]=useState({ 
        id:"",  
        first_name:"",
        mid_name:"",
        last_name:"",
        secondary_last_name:"",
        national_id:"",
        sys_code:"",
        phone:"",
        status_id:"",
        created_at:new Date(),
        modified_at: new Date(),
        disabled_at: new Date()
    })

    const [state, setState] = useState([]);

    const handleChange=e=>{
      setClientSeleccionado((clientSeleccionado)=>({
        ...clientSeleccionado,
        [e.target.name]: e.target.value
      }))
      console.log(clientSeleccionado);
    }

     
    
      const classes = useStyles();

      const handleClose = () => {
        setState({dialogOpen: false});
      };

    const peticionGet=async()=>{
        await axios.get(baseUrl)
        .then(response=>{
         setData(response.data);
        }).catch(error=>{
          console.log(error);
        })
      }

      const peticionPut=async()=>{
        await axios.put(baseUrl+"/"+clientSeleccionado.id, clientSeleccionado)
        .then(response=>{
          var dataNueva= data;
          dataNueva.map(client=>{
            if(client.id===clientSeleccionado.id){
              client.first_name=clientSeleccionado.first_name;
              client.second_name=clientSeleccionado.second_name;
              client.last_name=clientSeleccionado.last_name;
              client.secondary_last_name=clientSeleccionado.secondary_last_name;
              client.national_id=clientSeleccionado.national_id;
              client.sys_code=clientSeleccionado.sys_code;
              client.phone=clientSeleccionado.phone;
              client.status_id=clientSeleccionado.status_id;
            }
          });
          setData(dataNueva);
          handleClose();
        }).catch(error=>{
          console.log(error);
        })
      }



    const seleccionarCliente=(clientSeleccionado, caso)=>{
        setClientSeleccionado(clientSeleccionado);
        (caso==="Editar")?abrirCerrarModalEditar()
        :
        abrirCerrarModalEliminar()
      }

    const abrirCerrarModalInsertar=()=>{
        setModalInsertar(!modalInsertar);
      }
         
      const abrirCerrarModalEditar=()=>{
        setModalEditar(!modalEditar);
      }
    
      const abrirCerrarModalEliminar=()=>{
        setModalEliminar(!modalEliminar);
      }


      useEffect(()=>{
        peticionGet();
      }, [])

    return(
        <div className = "Table">
            <br/>
            <InsertClient
            edge = "end"
            onSave = {()=>{
              setSnackOpen("Cliente Agregado")
            }}
            render = {(open) => (
              <Button variant = "outlined" color = "primary" edge = "end" onClick = {open}>
                Insertar Nuevo Cliente
              </Button>
            )}
          />
            <br/><br/>
            <MaterialTable
                icons = {tableIcons}
                columns = {columns}
                data = {data}
                title = "Clientes"
                actions={[
                    {
                        icon: EditIcon,
                        tooltip: 'Editar Cliente',
                        onClick: rowData => {
                          setState({dialogOpen:true});
                        }
                    },
                    {
                      icon: DeleteIcon,
                      tooltip: 'Eliminar Cliente',
                      onClick: (event, rowData) => seleccionarCliente(rowData, "Eliminar")
                    }
                ]}
                options={{
                    actionsColumnIndex: -1,
                }}
                localization={{
                    header:{
                        actions: "Acciones"
                    }
                }}
            />
           <Dialog
              open={state.dialogOpen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                {data ? "Editar" : "Agregar"} Cliente{" "}
              </DialogTitle>
              <Divider/>
              <DialogContent>
              <Grid container lg = 'auto' spacing = {2} style = {{padding:20}}>
                      <Grid item lg ={4}>
                          <div className = "form-group">
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  name="first_name"
                                  label="Primer Nombre"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              />
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  name="mid_name"
                                  label="Segundo Nombre"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              />
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  name="last_name"
                                  label="Primer Apellido"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              />
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  name="secondary_last_name"
                                  label="Segundo Apellido"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              />
                              {/*<input placeholder= " " type = "text" className = "form-control" name = "client_first_name" onChange = {handleChange}/>*/}
                          </div>
                      </Grid>
                      <Grid item lg ={4}> 
                      <TextField
                                  autoFocus
                                  margin="dense"
                                  name="national_id"
                                  label="Cedula del Cliente"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              />
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  name="sys_code"
                                  label="Codigo del Cliente"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              />
                              <TextField
                                  autoFocus
                                  margin="dense"
                                  name="phone"
                                  label="Telefono del Trabajo"
                                  fullWidth
                                  onChange={handleChange}
                                  value = {clientSeleccionado && clientSeleccionado.first_name}
                              /> 
                          <FormControl className={classes.formControl}>
                            <NativeSelect
                              className={classes.selectEmpty}     
                              name="status_id"
                              onChange={handleChange}
                              value = {clientSeleccionado && clientSeleccionado.first_name}
                              inputProps={{ 'aria-label': 'status_id' }}
                            >
                              <option value="" disabled>
                                Estado del Cliente
                              </option>
                              <option value={'0'}>Activo</option>
                              <option value={'1'}>Inactivo</option>
                            </NativeSelect>
                            <FormHelperText>Estado del Trabajador</FormHelperText>
                          </FormControl>                                
                      </Grid>
                  </Grid>
              </DialogContent>
              <Divider/>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancelar
                </Button>
                {<Button onClick={peticionPut} color="primary">
                  Guardar
              </Button>}
              </DialogActions>
            </Dialog>  
        </div>
    );
}