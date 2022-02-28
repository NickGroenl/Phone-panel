import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();



/* NOTAS
  Detalles a resolver:
      Se siguen duplicando los usuarios y clientes (No se deberían duplicar si tienen el mismo nombre)

      EN PROVEEDORES
      En apellido falto cambiar a "Nombre de contacto" (X)
      Que telefono 2 e Email no sean obligatorios para guardar el registro (X)

      INVENTARIO:
      Que el precio venta no sea menor al precio compra y mayoreo. Que el precio mayoreo no sea menor a precio compra., Precio Mayoreo > (X) ($5 USD)

      ORDENES:
      1A.Inventario te había pedido que fuera cuadro de busqueda (es más practico y más facil de buscar los productos) (X) ($5 USD)
      2A.Cambiar nombre a campo "Número de telefono" a "Detalle de producto" (X)
      3A. Ordenar por:
      ID Producto, Cantidad (Con la posibilidad de aumentar, disminuir y cambiar cantidad), Iten (nombre de producto), Precio, Detalles, Eliminar. ($5 USD)
      4A. Que se visualice la cantidad total a pagar (X)
      5A. Tipo de pago no se seleccione (Predeterminado pago en efectivo) (X) ($5 USD)
      6A. Cambiar nombre a  "No pago" por "Credito" (X)
      7A. Cambiar nombre por "Deposito, transferencia u otro" (X)
      8A. Cambiar nombre "Nota" a "Detalles de pedido" (X)
      9A. No muestra la cantidad a dar de cambio (Ejemplo se está pagando con $2500 la cantidad de $2200. Allí debería aparecer $300) (X)
      10A. Que haya una opción para seleccionar (1.Mostrar Ticket de orden o 2.Enviar por Whatsapp) Para que al dar click en "Finalizar" realice la acción. ($5 USD) (X)
      11A. Agregar a Orden de Pedido opción ¿Es pedido a domicilio?  (X)
      12A. El precio de inventario para cliente dependa de tipo de usuario: "Publico"="Precio Venta" "Mayorista"="Precio Mayoreo"  (X) ($10 USD)

      10.1A Datos en ticket (X) 
      10.2A Enviar por Whatsapp: (X)
      NOMBRE DE NEGOCIO
      Nuevo Pedido* 📦 #00-1
      ▪1 CelularS $1000 MXN  
      ▪1 CelularX $1200 MXN  
      Total: $2200.00 MXN

      Detalles de pedido: 
      XXXX
      YYYY
      Cliente:
      Nombre cliente
      6631239900


      ORDENES -VER TODO:
      1B. Ordenar por:
      ID Orden, Items (Cantidad de productos), Cliente, Estado (pago), Tipo de pago, Total de pago, Añadido, Opciones 1Bb.(Abonar o pagar) 2Bb(Mostrar ticket o Enviar por WhatsApp) (X)  ($5 USD)
      2B.Agregar Botón Acciones. Mostrar los datos "Detalles de productos y pedido", enviar Whatsapp (X) ($5 USD)
      3B.En la opción "Abonar o pagar" Mostrar los detalles de pedido y cuando se cubra el pago se cambie de estado pago a "Pagado" (X) ($5 USD)
      4B. Botón Exportar Ordenes en Excel y PDF (ID Orden, Items (Cantidad de productos), Cliente, Estado (pago), Tipo de pago, Total de pago, Añadido, Detalles. ($5 USD)
      5B.Graficar u ordenar información como Cantidad de ordenes, Pendietes de pago, Productos más vendidos etc.


      1C.En el módulo inventario agregar unos nuevos campos:  ($10 USD)
      📝Disponible(Si,No),
      📝Venta online(Si,No) 
      📝¿Envio a domicilio? (Sí,No)


      MODULO CONFIGURAR CUENTA agregar campos: (Que esos datos sirvan para los datos de ticket) ($15 USD)
      📝Nombre de Negocio
      📝Telefono
      📝Dirección
      📝Foto de perfil como logo

      📝Ofrecer venta en linea(Si,No) 
      📝¿Envio a domicilio? (Sí,No)


      ✏️MODULO SERVICIOS: ($80 USD)
      Tipo de servicio (Programación, Reparacación, Garantía)
      Servicio
      Marca
      Modelo
      Carrier
      Precio
      garantía
      Venta en línea (Si,No)
      Detalles:

      ✏️Módulo Gastos, Compras: ($80 USD)
      -Gasto a orden de servicio: No. ODS, Cantidad, Tipo de gasto (Pantalla, C. Carga, Batería, Tapa, Flex, otro), Notas.
      -Compras: Tipo de compra (Refacciones, Insumos, herramientas, otro) Cantidad, Notas
      -Ingreso: Tipo de ingreso, cantidad, notas

      Total a pagar: 225 USD


*/