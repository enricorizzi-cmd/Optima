import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useClients, useSuppliers, useRawMaterials, useFinishedProducts, useWarehouses, useOperators, useCreateClient, useUpdateClient, useCreateRawMaterial, useUpdateRawMaterial, } from '../features/catalog/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../components/ui/use-toast';
import { ClientForm } from '../features/catalog/components/ClientForm';
import { RawMaterialForm } from '../features/catalog/components/RawMaterialForm';
const tabs = [
    { key: 'clients', label: 'Clienti' },
    { key: 'suppliers', label: 'Fornitori' },
    { key: 'raw', label: 'Materie prime' },
    { key: 'finished', label: 'Prodotti finiti' },
    { key: 'warehouses', label: 'Magazzini' },
    { key: 'operators', label: 'Operatori' },
];
export function CatalogPage() {
    const [activeTab, setActiveTab] = useState('clients');
    const [clientDialogOpen, setClientDialogOpen] = useState(false);
    const [editingClientId, setEditingClientId] = useState(null);
    const [rawMaterialDialogOpen, setRawMaterialDialogOpen] = useState(false);
    const [editingRawMaterialId, setEditingRawMaterialId] = useState(null);
    const { toast } = useToast();
    const { data: clients } = useClients();
    const { data: suppliers } = useSuppliers();
    const { data: rawMaterials } = useRawMaterials();
    const { data: finishedProducts } = useFinishedProducts();
    const { data: warehouses } = useWarehouses();
    const { data: operators } = useOperators();
    const createClient = useCreateClient({
        onSuccess: () => {
            toast({ title: 'Cliente salvato', description: 'Cliente creato correttamente', variant: 'success' });
            setClientDialogOpen(false);
            setEditingClientId(null);
        },
        onError: (error) => {
            toast({ title: 'Impossibile salvare il cliente', description: error.message, variant: 'destructive' });
        },
    });
    const updateClient = useUpdateClient({
        onSuccess: () => {
            toast({ title: 'Cliente aggiornato', description: 'Dati anagrafici aggiornati', variant: 'success' });
            setClientDialogOpen(false);
            setEditingClientId(null);
        },
        onError: (error) => {
            toast({ title: 'Aggiornamento non riuscito', description: error.message, variant: 'destructive' });
        },
    });
    const createRawMaterial = useCreateRawMaterial({
        onSuccess: () => {
            toast({ title: 'Materia prima salvata', description: 'Catalogo aggiornato', variant: 'success' });
            setRawMaterialDialogOpen(false);
            setEditingRawMaterialId(null);
        },
        onError: (error) => {
            toast({ title: 'Errore su materia prima', description: error.message, variant: 'destructive' });
        },
    });
    const updateRawMaterial = useUpdateRawMaterial({
        onSuccess: () => {
            toast({ title: 'Materia prima aggiornata', description: 'Dati salvati con successo', variant: 'success' });
            setRawMaterialDialogOpen(false);
            setEditingRawMaterialId(null);
        },
        onError: (error) => {
            toast({ title: 'Aggiornamento non riuscito', description: error.message, variant: 'destructive' });
        },
    });
    const editingClient = useMemo(() => clients?.find((client) => client.id === editingClientId) ?? null, [clients, editingClientId]);
    const editingRawMaterial = useMemo(() => rawMaterials?.find((material) => material.id === editingRawMaterialId) ?? null, [rawMaterials, editingRawMaterialId]);
    const isClientSaving = createClient.isPending || updateClient.isPending;
    const isRawMaterialSaving = createRawMaterial.isPending || updateRawMaterial.isPending;
    return (_jsxs("div", { className: "grid gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Anagrafiche principali" }), _jsx(CardDescription, { children: "Gestisci clienti, fornitori e risorse di produzione con un unico data hub." })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.key), className: `rounded-2xl border px-4 py-2 text-sm transition-colors ${activeTab === tab.key
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg transform scale-105'
                                    : 'border-gray-800 bg-gray-100 text-gray-900 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 shadow-md'}`, children: tab.label }, tab.key))) }) })] }), activeTab === 'clients' && (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Clienti" }), _jsx(CardDescription, { children: "Stato commerciale e agenti assegnati." })] }), _jsxs(Dialog, { open: clientDialogOpen, onOpenChange: (open) => {
                                    setClientDialogOpen(open);
                                    if (!open) {
                                        setEditingClientId(null);
                                    }
                                }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { onClick: () => setEditingClientId(null), children: "Nuovo cliente" }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: editingClient ? 'Modifica cliente' : 'Nuovo cliente' }) }), _jsx(ClientForm, { defaultValues: editingClient ?? undefined, loading: isClientSaving, onSubmit: (values) => {
                                                    if (editingClient) {
                                                        updateClient.mutate({ id: editingClient.id, payload: values });
                                                    }
                                                    else {
                                                        createClient.mutate(values);
                                                    }
                                                } }), _jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", className: "mt-4 w-full", disabled: isClientSaving, children: "Annulla" }) })] })] })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Codice" }), _jsx(Th, { children: "Ragione sociale" }), _jsx(Th, { children: "Agente" }), _jsx(Th, { children: "Tipologia" }), _jsx(Th, { children: "Categoria" }), _jsx(Th, { children: "Contatti" }), _jsx(Th, { children: "Azioni" })] }) }), _jsx(Tbody, { children: clients?.map((client) => (_jsxs(Tr, { children: [_jsx(Td, { children: client.code }), _jsx(Td, { children: client.name }), _jsx(Td, { children: client.agent ?? '-' }), _jsx(Td, { children: _jsx(Badge, { variant: "outline", children: client.type }) }), _jsx(Td, { children: client.category }), _jsx(Td, { children: _jsxs("div", { className: "flex flex-col text-xs text-white/60", children: [client.email, client.phone] }) }), _jsx(Td, { children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                            setEditingClientId(client.id);
                                                            setClientDialogOpen(true);
                                                        }, children: "Modifica" }) })] }, client.id))) })] }), clients && clients.length === 0 && _jsx("p", { className: "mt-4 text-sm text-white/50", children: "Nessun cliente registrato." })] })] })), activeTab === 'suppliers' && (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Fornitori" }), _jsx(CardDescription, { children: "Ultimi accordi e condizioni di pagamento." })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Codice" }), _jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Pagamento" }), _jsx(Th, { children: "Categoria" }), _jsx(Th, { children: "Contatti" })] }) }), _jsx(Tbody, { children: suppliers?.map((supplier) => (_jsxs(Tr, { children: [_jsx(Td, { children: supplier.code }), _jsx(Td, { children: supplier.name }), _jsx(Td, { children: supplier.payment_terms ?? '-' }), _jsx(Td, { children: supplier.category }), _jsx(Td, { children: _jsxs("div", { className: "flex flex-col text-xs text-white/60", children: [supplier.email, supplier.phone] }) })] }, supplier.id))) })] }), suppliers && suppliers.length === 0 && _jsx("p", { className: "mt-4 text-sm text-white/50", children: "Nessun fornitore registrato." })] })] })), activeTab === 'raw' && (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Materie prime" }), _jsx(CardDescription, { children: "Classi, gruppi e ultimo prezzo di acquisto." })] }), _jsxs(Dialog, { open: rawMaterialDialogOpen, onOpenChange: (open) => {
                                    setRawMaterialDialogOpen(open);
                                    if (!open) {
                                        setEditingRawMaterialId(null);
                                    }
                                }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { onClick: () => setEditingRawMaterialId(null), children: "Nuova materia prima" }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: editingRawMaterial ? 'Modifica materia prima' : 'Nuova materia prima' }) }), _jsx(RawMaterialForm, { defaultValues: editingRawMaterial ?? undefined, suppliers: suppliers ?? [], loading: isRawMaterialSaving, onSubmit: (values) => {
                                                    if (editingRawMaterial) {
                                                        updateRawMaterial.mutate({ id: editingRawMaterial.id, payload: values });
                                                    }
                                                    else {
                                                        createRawMaterial.mutate(values);
                                                    }
                                                } }), _jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", className: "mt-4 w-full", disabled: isRawMaterialSaving, children: "Annulla" }) })] })] })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Codice" }), _jsx(Th, { children: "Descrizione" }), _jsx(Th, { children: "Classe" }), _jsx(Th, { children: "Gruppo" }), _jsx(Th, { children: "UM" }), _jsx(Th, { children: "Ultimo prezzo" }), _jsx(Th, { children: "Azioni" })] }) }), _jsx(Tbody, { children: rawMaterials?.map((item) => (_jsxs(Tr, { children: [_jsx(Td, { children: item.code }), _jsx(Td, { children: item.name }), _jsx(Td, { children: item.class }), _jsx(Td, { children: item.group }), _jsx(Td, { children: item.unit_of_measure }), _jsx(Td, { children: item.last_purchase_price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }) }), _jsx(Td, { children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                            setEditingRawMaterialId(item.id);
                                                            setRawMaterialDialogOpen(true);
                                                        }, children: "Modifica" }) })] }, item.id))) })] }), rawMaterials && rawMaterials.length === 0 && (_jsx("p", { className: "mt-4 text-sm text-white/50", children: "Carica le tue materie prime per iniziare la programmazione." }))] })] })), activeTab === 'finished' && (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Prodotti finiti" }), _jsx(CardDescription, { children: "Classificazione per linea produttiva e unita di misura." })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Codice" }), _jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Classe" }), _jsx(Th, { children: "Gruppo" }), _jsx(Th, { children: "Tipo" }), _jsx(Th, { children: "UM" })] }) }), _jsx(Tbody, { children: finishedProducts?.map((product) => (_jsxs(Tr, { children: [_jsx(Td, { children: product.code }), _jsx(Td, { children: product.name }), _jsx(Td, { children: product.class }), _jsx(Td, { children: product.group }), _jsx(Td, { children: product.type }), _jsx(Td, { children: product.unit_of_measure })] }, product.id))) })] }), finishedProducts && finishedProducts.length === 0 && _jsx("p", { className: "mt-4 text-sm text-white/50", children: "Nessun prodotto finito registrato." })] })] })), activeTab === 'warehouses' && (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Magazzini" }), _jsx(CardDescription, { children: "Sedi e linee di riferimento." })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Codice" }), _jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Sede" }), _jsx(Th, { children: "Linea" })] }) }), _jsx(Tbody, { children: warehouses?.map((warehouse) => (_jsxs(Tr, { children: [_jsx(Td, { children: warehouse.code }), _jsx(Td, { children: warehouse.name }), _jsx(Td, { children: warehouse.site }), _jsx(Td, { children: warehouse.line })] }, warehouse.id))) })] }), warehouses && warehouses.length === 0 && _jsx("p", { className: "mt-4 text-sm text-white/50", children: "Definisci almeno un magazzino di riferimento." })] })] })), activeTab === 'operators' && (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Operatori" }), _jsx(CardDescription, { children: "Responsabili di linea e contatti rapidi." })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Email" }), _jsx(Th, { children: "Telefono" }), _jsx(Th, { children: "Magazzino" })] }) }), _jsx(Tbody, { children: operators?.map((operator) => (_jsxs(Tr, { children: [_jsxs(Td, { children: [operator.first_name, " ", operator.last_name] }), _jsx(Td, { children: operator.email }), _jsx(Td, { children: operator.phone ?? '-' }), _jsx(Td, { children: operator.warehouse_id })] }, operator.id))) })] }), operators && operators.length === 0 && (_jsx("p", { className: "mt-4 text-sm text-white/50", children: "Assegna gli operatori alle linee per monitorare l'avanzamento." }))] })] }))] }));
}

