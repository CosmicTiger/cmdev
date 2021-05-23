import React, { useState } from 'react';
import { forwardRef } from 'react';
import MaterialTable from "material-table";
import "./LoanTable.css";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
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
import DoubleArrow from '@material-ui/icons/DoubleArrow';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, makeStyles, TextField } from '@material-ui/core';
import InsertLoans from './InsertLoans';
import { TimelineOppositeContent } from '@material-ui/lab';
import InsertClient from '../Clients/InsertClient';
import InsertPayment from '../Loans/InsertPayment';
import { useDispatch } from 'react-redux';

const columns = [
    {
        title: 'Codigo del Prestamo',
        field: 'loan_code'
    },
    {
        title: 'Cliente',
        field: 'client'
    },
    {
        title: 'Monto Prestado',
        field: 'mount'
    },
    {
        title: 'Interes',
        field: 'interest'
    },
    {
        title: 'Deuda Total',
        field: 'total'
    },
    {
        title: 'Plazo',
        field: 'term'
    },
    {
        title: 'Frecuencia',
        field: 'freq'
    },
    {
        title: 'Area del Prestamo',
        field: 'area'
    }
];

const data = [
    {
        "loan_code": "2545-265",
        "client": "Obed Herrera",
        "mount": "C$ 2500",
        "interest": "6%",
        "total": "C$ 2650",
        "term": "2 Meses",
        "freq": "Semanal",
        "area":"Empresas"
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
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    DoubleArrow: forwardRef((props, ref) => <DoubleArrow {...props} ref={ref} />)
};

const useStyles = makeStyles((theme)=>({
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


export default function LoanTable(render, onSave){
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [state, setState] = useState([]);
    const [dialogOpenAdd, setDialogOpenAdd] = useState(false);
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        id_credi_payment:'',
        credi_payment_mount:''
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const action = data;
        dispatch(action({user: user}));
        onSave && onSave();
        handleClose();
    }

    return(
        <div className = "Table">
            <br/>
            <InsertLoans
                edge = "end"
                onSave = {()=>{
                    setSnackOpen("Prestamo agregado")
                }}
                render = {(open)=>(
                    <Button variant = "outlined" color = "primary" edge = "end" onClick = {open}>
                        Insertar nuevo prestamo
                    </Button>
                )}
            />
            <br/><br/>
            <MaterialTable
                icons = {tableIcons}
                columns = {columns}
                data = {data}
                title = "Prestamos"
                actions = {[
                    {
                        icon: EditIcon,
                        tooltip: 'Editar Prestamo',
                        onClick: rowData =>{
                            setState({dialogOpen:true});
                        },  
                    },
                    {
                        icon: DoubleArrow,
                        tooltip: 'Agregar pago',
                        onClick: (event, rowData) => {
                            setDialogOpenAdd(true)
                        },
                    }
                    
                ]}
                options={{
                    actionsColumnIndex: -1,
                }}
                localization={{
                    header:{
                        actions: "Acciones"
                    },
                    toolbar:{
                        nRowsSelected: "{0} fila(s) seleccionada",
                        searchTooltip: "Buscar",
                        searchPlaceholder: "Buscar"
                    }
                }}
                options ={{
                    selection: true

                }}
            />
            <Dialog open = {dialogOpenAdd}>
                <DialogTitle id = "form-dialog-title">
                    {"Agregar"} Pago {" "}
                </DialogTitle>
            </Dialog>
        </div>
    );
}