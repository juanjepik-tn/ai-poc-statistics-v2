// import { useFetch } from '@/hooks';
// import { useToast } from '@nimbus-ds/components';
import React, { useState } from 'react';

const dummyInstancesArray = [
    {
        "store": {
            "id": 17,
            "name": "Delivery al Paso",
            "schedules_text": "Viernes, S\u00e1bados y Domingos de 19:30 a 00:00",
            "waiting_time": "15",
            "delivery_fee": 1000,
            "address": {
                "id": 46,
                "street": "2 de Abril",
                "houseNumber": "690",
                "city": {
                    "id": 3,
                    "name": "Venado Tuerto",
                    "province": "\/api\/provinces\/5",
                    "utc": -3,
                    "utc_name": null
                },
                "details": null
            },
            "currency": {
                "id": 1,
                "name": "Peso Argentino",
                "symbol": "$",
                "abbreviation": "ARS"
            },
            "state": {
                "id": 2386,
                "name": "Open",
                "created_at": "2024-06-13T21:09:19+00:00"
            },
            "paymentMethods": [
                {
                    "enterprise": "",
                    "class": "payement-method-cash",
                    "id": 34,
                    "name": "Cash",
                    "description": null,
                    "active": true,
                    "defaultOption": true,
                    "delivery": null,
                    "takeaway": null
                },
                {
                    "cbu": "ALIAS: delivery.alpaso.mp",
                    "class": "payement-method-wire-transfer",
                    "id": 35,
                    "name": "Wire Transfer",
                    "enterprise": "Mercado Pago",
                    "description": null,
                    "active": true,
                    "defaultOption": false,
                    "delivery": null,
                    "takeaway": null
                },
                {
                    "cbu": "delivery.alpaso.mp",
                    "class": "payement-method-wire-transfer",
                    "id": 38,
                    "name": "Wire Transfer",
                    "enterprise": "Mercado Pago, el alias para transferir es: \u201cdelivery.alpaso.mp\u201d",
                    "description": null,
                    "active": true,
                    "defaultOption": false,
                    "delivery": null,
                    "takeaway": null
                },
                {
                    "cbu": "delivery.alpaso.mp",
                    "class": "payement-method-wire-transfer",
                    "id": 60,
                    "name": "Wire Transfer",
                    "enterprise": "Mercado Pago, el alias para transferir es: \u201cdelivery.alpaso.mp\u201d",
                    "description": null,
                    "active": true,
                    "defaultOption": false,
                    "delivery": null,
                    "takeaway": null
                }
            ],
            "type": {
                "id": 1,
                "name": "Food Store"
            },
            "delivery": false,
            "takeaway": true,
            "delivery_zone": "Venado Tuerto",
            "orderStateWorkflow": {
                "id": 2,
                "name": "Large",
                "description": "3 Pasos: Aceptar, En Camino y Finalizar\r\n"
            },
            "notifications": true,
            "language": {
                "id": 1,
                "name": "Espa\u00f1ol"
            },
            "welcome_message": "Bienvenido a Delivery al Paso",
            "send_pdf": true,
            "closed_message": "Lo sentimos, por el momento no estamos tomando pedidos. Nuestro horario de atenci\u00f3n es de Viernes a Domingo de 19:30 a 23:30.\nSi escribiste dentro del horario es posible que nos encontremos con mucha demanda.",
            "billingPlan": {
                "id": 4,
                "name": "Testing",
                "created_at": "2023-12-15T12:55:09+00:00"
            },
            "deliveryMethod": null,
            "delivery_paused": false,
            "alternative_currency": null,
            "exchange_rate": null,
            "min_amount_delivery": null,
            "closed_paused": false,
            "closed_paused_message": "Lo sentimos, por el momento no estamos tomando pedidos. Nuestro horario de atenci\u00f3n es de Viernes a Domingo de 19:30 a 23:30.",
            "new_method": false,
            "close_orders_automatically": false,
            "ask_min_amount_delivery": null,
            "whatsapp": [],
            "default_virtual_assistant": 133,
            "store_categories": [
                {
                    "id": 3,
                    "name": "Hamburgueser\u00eda",
                    "description": null
                }
            ],
            "faqs": [
                {
                    "id": 33,
                    "question": "\u00bfTrabajas con Billetera Santa Fe? \u00bfTe puedo pagar con Billetera?",
                    "answer": "No aceptamos pagos con Billetera Santa Fe"
                },
                {
                    "id": 48,
                    "question": "\u00bfse puede agregar cheddar a las papas del combo? \u00bfSe puede modificar el combi? \u00bfLe podes poner cheddar a las papas del combo? ",
                    "answer": "Los combos se venden como se ofrece, si queres agregado de cheddar se pide una bandeja aparte"
                },
                {
                    "id": 423,
                    "question": "Qu\u00e9 aderezos ten\u00e9s?",
                    "answer": "Mayonesa, salsa barbacoa, salsa cheddar, salsa parmesano, salsa criolla, salsa roquefort, chimi, ketchup mostaza"
                }
            ],
            "billingPlanHistories": [
                {
                    "id": 78,
                    "billingPlan": {
                        "id": 4,
                        "name": "Testing",
                        "created_at": "2023-12-15T12:55:09+00:00"
                    },
                    "created_at": "2024-02-27T15:35:44+00:00"
                }
            ],
            "resume_observation": "",
            "created_at": "2023-11-24T10:24:00+00:00",
            "created_by": {
                "id": 1,
                "email": "admin@vici.la",
                "name": "Admin",
                "surname": "VICI",
                "state": {
                    "id": 2,
                    "name": "Active",
                    "created_at": "2023-11-13T10:31:46+00:00",
                    "stateId": 2
                },
                "created_at": "2023-08-03T15:35:52+00:00",
                "created_by": null,
                "updated_at": null,
                "updated_by": null,
                "storeUsers": [],
                "userRoles": [
                    "ROLE_ADMIN"
                ]
            },
            "updated_at": "2024-07-16T16:06:58+00:00",
            "updated_by": {
                "id": 125,
                "email": "ignacio.machado@vici.la",
                "name": "Ignacio",
                "surname": "Machado",
                "state": {
                    "id": 242,
                    "name": "Active",
                    "created_at": "2024-05-06T16:42:20+00:00",
                    "stateId": 2
                },
                "created_at": "2024-03-26T20:10:09+00:00",
                "created_by": {
                    "id": 1,
                    "email": "admin@vici.la",
                    "name": "Admin",
                    "surname": "VICI",
                    "state": {
                        "id": 2,
                        "name": "Active",
                        "created_at": "2023-11-13T10:31:46+00:00",
                        "stateId": 2
                    },
                    "created_at": "2023-08-03T15:35:52+00:00",
                    "created_by": null,
                    "updated_at": null,
                    "updated_by": null,
                    "storeUsers": [],
                    "userRoles": [
                        "ROLE_ADMIN"
                    ]
                },
                "updated_at": null,
                "updated_by": {
                    "id": 1,
                    "email": "admin@vici.la",
                    "name": "Admin",
                    "surname": "VICI",
                    "state": {
                        "id": 2,
                        "name": "Active",
                        "created_at": "2023-11-13T10:31:46+00:00",
                        "stateId": 2
                    },
                    "created_at": "2023-08-03T15:35:52+00:00",
                    "created_by": null,
                    "updated_at": null,
                    "updated_by": null,
                    "storeUsers": [],
                    "userRoles": [
                        "ROLE_ADMIN"
                    ]
                },
                "storeUsers": [
                    {
                        "id": 370,
                        "store": {
                            "id": 24,
                            "name": "Helader\u00eda Los Amores camb2o",
                            "schedules_text": "Lunes a Jueves de 11 a 01:00 hs  - Delivery hasta 00:30hs\nViernes y S\u00e1bado de 12 a 2 hs  - Delivery hasta 00:30hs\nDomingo de 11 a 01:00 hs - Delivery hasta 00:30hs",
                            "waiting_time": "30",
                            "delivery_fee": 800,
                            "address": {
                                "id": 117,
                                "street": "Colon hola",
                                "houseNumber": "236545",
                                "city": {
                                    "id": 10,
                                    "name": "Tres Arroyos",
                                    "province": "\/api\/provinces\/1",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 1,
                                "name": "Peso Argentino",
                                "symbol": "$",
                                "abbreviation": "ARS"
                            },
                            "state": {
                                "id": 2377,
                                "name": "Open",
                                "created_at": "2024-04-22T20:39:56+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 49,
                                    "name": "Cash",
                                    "description": "PESO RIOJANO",
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": true,
                                    "takeaway": false
                                },
                                {
                                    "cbu": "Enviar dinero a losamores.3a y luego enviar comprobante",
                                    "class": "payement-method-wire-transfer",
                                    "id": 51,
                                    "name": "Wire Transfer",
                                    "enterprise": "Transferencia bancaria",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "Enviar dinero al N\u00b0 de documento: 23.887.772  a nombre de Christian Mc Coubrey",
                                    "class": "payement-method-wire-transfer",
                                    "id": 52,
                                    "name": "Wire Transfer",
                                    "enterprise": "Cuenta DNI",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 333,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": false
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 334,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 335,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 336,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 337,
                                    "name": "Cash",
                                    "description": "PESO MEXICANO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.2",
                                    "class": "payement-method-wire-transfer",
                                    "id": 338,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO2",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 340,
                                    "name": "Cash",
                                    "description": "PESO CHILENO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 341,
                                    "name": "Cash",
                                    "description": "PESO URUGUAYO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 342,
                                    "name": "Cash",
                                    "description": "SOL PERUANO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 343,
                                    "name": "Cash",
                                    "description": "Peso Tucumano",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 344,
                                    "name": "Cash",
                                    "description": "Sol Peruano",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 345,
                                    "name": "Cash",
                                    "description": "PESO COLOMBIANO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": false
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 346,
                                    "name": "Cash",
                                    "description": "PESO SUDACA",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 347,
                                    "name": "Cash",
                                    "description": "Peso Japon\u00e9s",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": false
                                },
                                {
                                    "class": "payement-method-debit-card",
                                    "id": 348,
                                    "name": "Debit Card",
                                    "enterprise": "FRANCES",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.bna",
                                    "class": "payement-method-wire-transfer",
                                    "id": 349,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO BNA+",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": true
                                },
                                {
                                    "link": "http:\/\/link.pago",
                                    "class": "payement-method-link-button",
                                    "id": 352,
                                    "name": "Link Button",
                                    "enterprise": "VICI",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "El costo de env\u00edo es de $800 dentro de los caminos de cintura  y la ruta 3.\nFuera de los caminos de cintura y ruta 3, el costo del env\u00edo es de $1100\nEl costo del env\u00edo en la zona de quintas es de $1500\n",
                            "orderStateWorkflow": {
                                "id": 2,
                                "name": "Large",
                                "description": "3 Pasos: Aceptar, En Camino y Finalizar\r\n"
                            },
                            "notifications": true,
                            "language": {
                                "id": 1,
                                "name": "Espa\u00f1ol"
                            },
                            "welcome_message": "Los precios vigentes son: \n1\/4 $2.800\n1\/2 $4.900\n1kg $7.900\nPromo de 2kg $14.000\n\nSi pedis para retirar en el local y no lo abonas por transferencia, armaremos el pedido cuando pases a retirarlo.\n\nDelivery hasta 00:30hs:\n- Costo de env\u00edo $800\n- Fuera de zona $1100\n- Zona Quinta $1500",
                            "send_pdf": true,
                            "closed_message": "\u00a1Hola! ? En este momento no estamos tomando pedidos, nuestro servicio de delivery es de 12:00 a 16:00hs y de 20 a 00.30. \u00a1Gracias! ?",
                            "billingPlan": {
                                "id": 3,
                                "name": "Activo",
                                "created_at": "2023-12-15T04:58:00+00:00"
                            },
                            "deliveryMethod": {
                                "id": 8,
                                "price": null,
                                "delivery_zone": null,
                                "created_at": "2024-04-29T19:36:03+00:00",
                                "class": "delivery-method-variable",
                                "reason": "",
                                "deliveryZones": [
                                    {
                                        "id": 14,
                                        "name": "laguna",
                                        "description": "\u00f1agp!",
                                        "price": 1500,
                                        "active": true
                                    },
                                    {
                                        "id": 15,
                                        "name": "Centro",
                                        "description": "zona centro",
                                        "price": 1000,
                                        "active": true
                                    }
                                ]
                            },
                            "delivery_paused": null,
                            "alternative_currency": {
                                "id": 2,
                                "name": "Dolar Estadounidense",
                                "symbol": "U$D",
                                "abbreviation": "D\u00f3lar"
                            },
                            "exchange_rate": 1050,
                            "min_amount_delivery": 3553,
                            "closed_paused": false,
                            "closed_paused_message": "",
                            "new_method": null,
                            "close_orders_automatically": null,
                            "ask_min_amount_delivery": null,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 8,
                                    "name": "Bar",
                                    "description": "Ofrece distintas opciones para desayunar \u00f3 merendar, opciones saludables y nutritivas como as\u00ed tambi\u00e9n opciones para los amantes de sabores mas dulces. No requiere reservas, es atendido exclusivamente por sus due\u00f1os"
                                },
                                {
                                    "id": 9,
                                    "name": "Helader\u00eda",
                                    "description": "Las Helader\u00edas son comercios que venden helados y postres. Los cuales el cliente puede y debe escoger gustos de helado, dependiendo del tama\u00f1o que escoja, seleccionar\u00e1 m\u00e1s o menos gustos. "
                                }
                            ],
                            "faqs": [
                                {
                                    "id": 111,
                                    "question": "Cuales sabores son SIN TACC o para cel\u00edacos?",
                                    "answer": "Los siguientes sabores son SIN TACC o para cel\u00edacos: Chocolate, Chocolate Amargo, Sambay\u00f3n, DDL, DDL Granizado, Bananita Dolca, Granizado, Vainilla, Menta Granizada, Crema Americana, Banana Split, Cereza a la Crema, Frutilla a la Crema, Anan\u00e1, Durazno, Fr"
                                },
                                {
                                    "id": 112,
                                    "question": "Me pasar\u00edas los sabores\/gustos?",
                                    "answer": "Claro! Ac\u00e1 te mando la foto con todos los sabores."
                                }
                            ],
                            "billingPlanHistories": [],
                            "resume_observation": "",
                            "created_at": "2023-11-29T14:17:28+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-05-03T12:15:28+00:00",
                            "updated_by": {
                                "id": 28,
                                "email": "Crmccoubrey@gmail.com",
                                "name": "Christian",
                                "surname": "Mccoubrey",
                                "state": {
                                    "id": 63,
                                    "name": "Active",
                                    "created_at": "2023-11-29T14:21:00+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-11-29T14:20:50+00:00",
                                "created_by": {
                                    "id": 1,
                                    "email": "admin@vici.la",
                                    "name": "Admin",
                                    "surname": "VICI",
                                    "state": {
                                        "id": 2,
                                        "name": "Active",
                                        "created_at": "2023-11-13T10:31:46+00:00",
                                        "stateId": 2
                                    },
                                    "created_at": "2023-08-03T15:35:52+00:00",
                                    "created_by": null,
                                    "updated_at": null,
                                    "updated_by": null,
                                    "storeUsers": [],
                                    "userRoles": [
                                        "ROLE_ADMIN"
                                    ]
                                },
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [
                                    {
                                        "id": 33,
                                        "store": "\/api\/stores"
                                    }
                                ],
                                "userRoles": [
                                    "ROLE_ADMIN_TIENDA"
                                ]
                            },
                            "hasChannelConnected": true,
                            "channelsList": [
                                {
                                    "id": 344,
                                    "name": "WhatsappJS",
                                    "whatsapp_status": "Disconnected",
                                    "username": "542216738074",
                                    "bot_status": "Paused"
                                },
                                {
                                    "id": 392,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-5",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 393,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-6",
                                    "bot_status": "Active"
                                },
                                {
                                    "id": 394,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-7",
                                    "bot_status": "Active"
                                },
                                {
                                    "id": 395,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-8",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 401,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Connected",
                                    "username": "Helader\u00eda Los Amores camb2o-9",
                                    "bot_status": "Active"
                                },
                                {
                                    "id": 403,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-10",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 404,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Disconnected",
                                    "username": "Helader\u00eda Los Amores camb2o-11",
                                    "bot_status": "Paused"
                                },
                                {
                                    "id": 428,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Disconnected",
                                    "username": "Helader\u00eda Los Amores camb2o-12",
                                    "bot_status": "Paused"
                                }
                            ],
                            "channelCount": 12
                        }
                    },
                    {
                        "id": 371,
                        "store": {
                            "id": 26,
                            "name": "Caryco",
                            "schedules_text": "Lunes, Mi\u00e9rcoles, Jueves, Viernes 9.30 a 13.30 - 19 a 23\nS\u00e1bado y Domingo 10 a 14 y 19 a 23",
                            "waiting_time": "15",
                            "delivery_fee": 0,
                            "address": {
                                "id": 124,
                                "street": "Alvear",
                                "houseNumber": "1404",
                                "city": {
                                    "id": 3,
                                    "name": "Venado Tuerto",
                                    "province": "\/api\/provinces\/5",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 1,
                                "name": "Peso Argentino",
                                "symbol": "$",
                                "abbreviation": "ARS"
                            },
                            "state": {
                                "id": 2338,
                                "name": "Open",
                                "created_at": "2024-03-23T22:00:19+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 53,
                                    "name": "Cash",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "No recibimos transferencias. Solo pagos en efectivo y tarjeta en el local. Puedes realizar el pago con tarjeta de d\u00e9bito cuando el pedido sea para retiro en el local.",
                                    "class": "payement-method-wire-transfer",
                                    "id": 59,
                                    "name": "Wire Transfer",
                                    "enterprise": "D\u00e9bito",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "Se enviar\u00e1 el QR al finalizar su pedido",
                                    "class": "payement-method-wire-transfer",
                                    "id": 117,
                                    "name": "Wire Transfer",
                                    "enterprise": "QR",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "111111122222",
                                    "class": "payement-method-wire-transfer",
                                    "id": 355,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "Venado Tuerto",
                            "orderStateWorkflow": {
                                "id": 1,
                                "name": "Medium",
                                "description": "2 Pasos: Aceptar y Finalizar"
                            },
                            "notifications": false,
                            "language": {
                                "id": 1,
                                "name": "Espa\u00f1ol"
                            },
                            "welcome_message": "Bienvenido a Caryc\u00f3, en que podemos ayudarte hoy? El total del pedido te lo estaremos enviando una vez aceptado. Si tu pedido lo ven\u00eds a buscar al local podes pagar con D\u00e9bito o mediante codigo QR mediante alguna billetera virtual. El costo del delivery tiene un m\u00ednimo de $800 seg\u00fan la zona de entrega. ",
                            "send_pdf": true,
                            "closed_message": "Lo sentimos, en este momento no estamos tomando pedidos.\nLos dias MARTES el local se encuentra cerrado.",
                            "billingPlan": {
                                "id": 3,
                                "name": "Activo",
                                "created_at": "2023-12-15T04:58:00+00:00"
                            },
                            "deliveryMethod": null,
                            "delivery_paused": null,
                            "alternative_currency": null,
                            "exchange_rate": null,
                            "min_amount_delivery": null,
                            "closed_paused": null,
                            "closed_paused_message": "",
                            "new_method": true,
                            "close_orders_automatically": null,
                            "ask_min_amount_delivery": null,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 1,
                                    "name": "Rotiser\u00eda",
                                    "description": null
                                }
                            ],
                            "faqs": [
                                {
                                    "id": 25,
                                    "question": "Reciben pagos con transferencias? Puedo pagar con transferencia?",
                                    "answer": "No, lamentablemente solo recibimos pagos en efectivo. En nuestro local pod\u00e9s pagar con d\u00e9bito o con Codigo Qr mediante cuaquier billetera virtual!"
                                },
                                {
                                    "id": 32,
                                    "question": "\u00bfPuedo pagar con QR? \u00bfMe pasas el c\u00f3digo QR, para pagar?",
                                    "answer": "Si claro, en minutos te estar\u00e9 enviando el QR para poder abonar."
                                },
                                {
                                    "id": 34,
                                    "question": "\u00bfCu\u00e1nto sale el delivery? \u00bfCu\u00e1l es el costo del env\u00edo?",
                                    "answer": "El costo del delivery tiene un m\u00ednimo de $700 seg\u00fan la zona de entrega."
                                },
                                {
                                    "id": 62,
                                    "question": "\u00bfCu\u00e1nto sale X producto?",
                                    "answer": "En breve te indicaremos el precio de ese producto."
                                },
                                {
                                    "id": 63,
                                    "question": "\u00bfCu\u00e1l es el precio de X producto?",
                                    "answer": "En breve te indicaremos el precio de ese producto."
                                }
                            ],
                            "billingPlanHistories": [],
                            "resume_observation": "",
                            "created_at": "2023-11-30T12:17:42+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-04-10T17:32:05+00:00",
                            "updated_by": "\/api\/users",
                            "hasChannelConnected": false,
                            "channelsList": [
                                {
                                    "id": 350,
                                    "name": "WhatsappJS",
                                    "whatsapp_status": "Disconnected",
                                    "username": "54JS-Esmeralda",
                                    "bot_status": "Paused"
                                },
                                {
                                    "id": 351,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "54Baileys-Esmeralda",
                                    "bot_status": "Created"
                                }
                            ],
                            "channelCount": 8
                        }
                    },
                    {
                        "id": 372,
                        "store": "\/api\/stores"
                    },
                    {
                        "id": 373,
                        "store": {
                            "id": 58,
                            "name": "La Burguesita",
                            "schedules_text": "Miercoles, Jueves, Viernes, Sabados, Doimingos y Lunes de 19:00 a 23:00 hs",
                            "waiting_time": "45 min",
                            "delivery_fee": 250,
                            "address": {
                                "id": 1059,
                                "street": "Calle 11 entre 153 y 154",
                                "houseNumber": "2925",
                                "city": {
                                    "id": 22,
                                    "name": "Berisso",
                                    "province": "\/api\/provinces\/1",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 1,
                                "name": "Peso Argentino",
                                "symbol": "$",
                                "abbreviation": "ARS"
                            },
                            "state": {
                                "id": 1122,
                                "name": "Closed",
                                "created_at": "2024-01-27T01:06:06+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 121,
                                    "name": "Cash",
                                    "description": "Pesos Argentinos",
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "Te paso el CAROALBER.MP  -   Cuando transferis por favor env\u00edanos el COMPROBANTE para dar curso al pedido ",
                                    "class": "payement-method-wire-transfer",
                                    "id": 135,
                                    "name": "Wire Transfer",
                                    "enterprise": "Mercado Pago",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 354,
                                    "name": "Cash",
                                    "description": "Dolares",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "Desde Calle 38 hasta la calle Genova\nDesde calle 143 hasta la calle Montevideo",
                            "orderStateWorkflow": {
                                "id": 2,
                                "name": "Large",
                                "description": "3 Pasos: Aceptar, En Camino y Finalizar\r\n"
                            },
                            "notifications": false,
                            "language": {
                                "id": 1,
                                "name": "Espa\u00f1ol"
                            },
                            "welcome_message": "\u00a1Bienvenido a la Burguesita!",
                            "send_pdf": true,
                            "closed_message": "Por el momento no estamos tomando pedidos, disculpa!",
                            "billingPlan": {
                                "id": 2,
                                "name": "Periodo de Prueba",
                                "created_at": "2023-12-15T04:57:36+00:00"
                            },
                            "deliveryMethod": {
                                "id": 17,
                                "price": null,
                                "delivery_zone": null,
                                "created_at": "2024-05-20T02:58:37+00:00",
                                "class": "delivery-method-variable",
                                "reason": "",
                                "deliveryZones": [
                                    {
                                        "id": 25,
                                        "name": "La Matanza",
                                        "description": "Zona de la matanza",
                                        "price": 400,
                                        "active": true
                                    }
                                ]
                            },
                            "delivery_paused": null,
                            "alternative_currency": {
                                "id": 2,
                                "name": "Dolar Estadounidense",
                                "symbol": "U$D",
                                "abbreviation": "D\u00f3lar"
                            },
                            "exchange_rate": 0.001,
                            "min_amount_delivery": 5000,
                            "closed_paused": null,
                            "closed_paused_message": "",
                            "new_method": true,
                            "close_orders_automatically": false,
                            "ask_min_amount_delivery": true,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 29,
                                    "name": "Rotiseria Local",
                                    "description": "Este comercio es una rotiseria"
                                }
                            ],
                            "faqs": [],
                            "billingPlanHistories": [
                                {
                                    "id": 2,
                                    "billingPlan": {
                                        "id": 1,
                                        "name": "Onboarding",
                                        "created_at": "2023-12-15T04:57:26+00:00"
                                    },
                                    "created_at": "2024-01-04T18:28:23+00:00"
                                }
                            ],
                            "resume_observation": "",
                            "created_at": "2024-01-04T18:28:23+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-05-06T11:50:54+00:00",
                            "updated_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "hasChannelConnected": false,
                            "channelsList": [
                                {
                                    "id": 399,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "54AlonBYS",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 400,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "54prueba-alonso",
                                    "bot_status": "Created"
                                }
                            ],
                            "channelCount": 5
                        }
                    },
                    {
                        "id": 374,
                        "store": {
                            "id": 92,
                            "name": "Pizzeria El Molino Platense",
                            "schedules_text": "Lunes a Sabado de 11:30 a 14:00 y de 19:30 a 23:00\nDomingo de 19:30 a 23:00 HORARIO ARGENTINA",
                            "waiting_time": "15",
                            "delivery_fee": 600,
                            "address": {
                                "id": 3920,
                                "street": "4735",
                                "houseNumber": "15851",
                                "city": {
                                    "id": 9,
                                    "name": "Junin",
                                    "province": "\/api\/provinces\/1",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 4,
                                "name": "Peso Mexicano",
                                "symbol": "$",
                                "abbreviation": "MXN"
                            },
                            "state": {
                                "id": 2374,
                                "name": "Open",
                                "created_at": "2024-04-11T17:06:51+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 235,
                                    "name": "Cash",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "El Alias para transferencia es JORGELINA.OVIEDO  -  a nombre de Jorgelina Grisel Oviedo - Por favor enviar comprobante",
                                    "class": "payement-method-wire-transfer",
                                    "id": 236,
                                    "name": "Wire Transfer",
                                    "enterprise": "Mercado Pago",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "El Alias para cuenta DNI es JORGELINAOVIEDO.DNI - a nombre de Jorgelina Grisel Oviedo - Por Favor enviar el comprobante",
                                    "class": "payement-method-wire-transfer",
                                    "id": 251,
                                    "name": "Wire Transfer",
                                    "enterprise": "Cuenta DNI",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "City Bell - Villa Castels - Villa Elisa",
                            "orderStateWorkflow": {
                                "id": 1,
                                "name": "Medium",
                                "description": "2 Pasos: Aceptar y Finalizar"
                            },
                            "notifications": false,
                            "language": {
                                "id": 3,
                                "name": "Portugu\u00e9s"
                            },
                            "welcome_message": "welcome cari\u00f1ooo o",
                            "send_pdf": true,
                            "closed_message": "",
                            "billingPlan": {
                                "id": 2,
                                "name": "Periodo de Prueba",
                                "created_at": "2023-12-15T04:57:36+00:00"
                            },
                            "deliveryMethod": {
                                "id": 7,
                                "price": null,
                                "delivery_zone": null,
                                "created_at": "2024-04-29T14:48:15+00:00",
                                "class": "delivery-method-variable",
                                "reason": "",
                                "deliveryZones": [
                                    {
                                        "id": 12,
                                        "name": "juan",
                                        "description": "sdfsdfsdfsdf",
                                        "price": 1275,
                                        "active": true
                                    },
                                    {
                                        "id": 13,
                                        "name": "los hornos ",
                                        "description": "addsdksldsld ",
                                        "price": 777,
                                        "active": true
                                    }
                                ]
                            },
                            "delivery_paused": null,
                            "alternative_currency": null,
                            "exchange_rate": 0,
                            "min_amount_delivery": 0,
                            "closed_paused": false,
                            "closed_paused_message": "En este momento no podemos tomar tu pedido, Disculpa!!",
                            "new_method": null,
                            "close_orders_automatically": false,
                            "ask_min_amount_delivery": false,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 1,
                                    "name": "Rotiser\u00eda",
                                    "description": null
                                },
                                {
                                    "id": 2,
                                    "name": "Pizzeria",
                                    "description": null
                                },
                                {
                                    "id": 3,
                                    "name": "Hamburgueser\u00eda",
                                    "description": null
                                }
                            ],
                            "faqs": [
                                {
                                    "id": 506,
                                    "question": "holu",
                                    "answer": "chaui"
                                }
                            ],
                            "billingPlanHistories": [
                                {
                                    "id": 65,
                                    "billingPlan": {
                                        "id": 1,
                                        "name": "Onboarding",
                                        "created_at": "2023-12-15T04:57:26+00:00"
                                    },
                                    "created_at": "2024-02-19T21:07:08+00:00"
                                },
                                {
                                    "id": 73,
                                    "billingPlan": {
                                        "id": 2,
                                        "name": "Periodo de Prueba",
                                        "created_at": "2023-12-15T04:57:36+00:00"
                                    },
                                    "created_at": "2024-02-24T02:08:23+00:00"
                                }
                            ],
                            "resume_observation": "El costo de env\u00edo puede VARIAR seg\u00fan la Zona, cuidado con lo que pedis! ;) :DD",
                            "created_at": "2024-02-19T21:07:08+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-07-04T13:48:59+00:00",
                            "updated_by": "\/api\/users",
                            "hasChannelConnected": true,
                            "channelsList": [
                                {
                                    "id": 468,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Connected",
                                    "username": "5492215440652",
                                    "bot_status": "Active"
                                }
                            ],
                            "channelCount": 7
                        }
                    }
                ],
                "userRoles": [
                    "ROLE_ADMIN_TIENDA",
                    "ROLE_ORDERS_CONVERSATIONS"
                ]
            },
            "hasChannelConnected": true,
            "channelsList": [
                {
                    "id": 469,
                    "name": "WhatsappBaileys",
                    "whatsapp_status": "Connected",
                    "username": "5492216955750",
                    "bot_status": "Active"
                },
                {
                    "id": 472,
                    "name": "WhatsappBaileys",
                    "whatsapp_status": "Disconnected",
                    "username": "Delivery al Paso-29",
                    "bot_status": "Created"
                }
            ],
            "channelCount": 29
        },
        "basePath": "\/api\/whatsapps-baileys",
        "basePathTest": "\/api\/whatsapps-baileys\/test",
        "qrCode": "2@st1EhNwGrZskJtuf\/q6KzT+CA2fIhi0eLxdSJfaT8pOKUuZJ4gTw9KeJtjTHt5EDAeyEpKyK83588w==,uXD0fONWrtyAVnZB5Yklt99jLv2o\/NYCPPBYMYPXFnE=,T\/qANhnrQg\/ZZEMeuDReQ1NepW85H\/Ez64A\/LsPBzzo=,4Rj\/klDTc1+wf4wldGo6oB+2ex29BUMPOHETP0qJeKM=",
        "actualStatus": {
            "id": 12932,
            "name": "Connected"
        },
        "id": 469,
        "username": "5492216955750",
        "state": {
            "id": 12620,
            "name": "Active",
            "created_at": "2024-07-24T16:24:29+00:00",
            "stateId": 2
        },
        "created_at": "2024-07-12T15:57:25+00:00",
        "updated_by": null,
        "updated_at": null,
        "virtualAssistant": {
            "id": 133,
            "name": "Langchain"
        },
        "channelName": "WhatsappBaileys",
        "conversationsCount": 16
    },
    {
        "store": {
            "id": 17,
            "name": "Delivery al Paso",
            "schedules_text": "Viernes, S\u00e1bados y Domingos de 19:30 a 00:00",
            "waiting_time": "15",
            "delivery_fee": 1000,
            "address": {
                "id": 46,
                "street": "2 de Abril",
                "houseNumber": "690",
                "city": {
                    "id": 3,
                    "name": "Venado Tuerto",
                    "province": "\/api\/provinces\/5",
                    "utc": -3,
                    "utc_name": null
                },
                "details": null
            },
            "currency": {
                "id": 1,
                "name": "Peso Argentino",
                "symbol": "$",
                "abbreviation": "ARS"
            },
            "state": {
                "id": 2386,
                "name": "Open",
                "created_at": "2024-06-13T21:09:19+00:00"
            },
            "paymentMethods": [
                {
                    "enterprise": "",
                    "class": "payement-method-cash",
                    "id": 34,
                    "name": "Cash",
                    "description": null,
                    "active": true,
                    "defaultOption": true,
                    "delivery": null,
                    "takeaway": null
                },
                {
                    "cbu": "ALIAS: delivery.alpaso.mp",
                    "class": "payement-method-wire-transfer",
                    "id": 35,
                    "name": "Wire Transfer",
                    "enterprise": "Mercado Pago",
                    "description": null,
                    "active": true,
                    "defaultOption": false,
                    "delivery": null,
                    "takeaway": null
                },
                {
                    "cbu": "delivery.alpaso.mp",
                    "class": "payement-method-wire-transfer",
                    "id": 38,
                    "name": "Wire Transfer",
                    "enterprise": "Mercado Pago, el alias para transferir es: \u201cdelivery.alpaso.mp\u201d",
                    "description": null,
                    "active": true,
                    "defaultOption": false,
                    "delivery": null,
                    "takeaway": null
                },
                {
                    "cbu": "delivery.alpaso.mp",
                    "class": "payement-method-wire-transfer",
                    "id": 60,
                    "name": "Wire Transfer",
                    "enterprise": "Mercado Pago, el alias para transferir es: \u201cdelivery.alpaso.mp\u201d",
                    "description": null,
                    "active": true,
                    "defaultOption": false,
                    "delivery": null,
                    "takeaway": null
                }
            ],
            "type": {
                "id": 1,
                "name": "Food Store"
            },
            "delivery": false,
            "takeaway": true,
            "delivery_zone": "Venado Tuerto",
            "orderStateWorkflow": {
                "id": 2,
                "name": "Large",
                "description": "3 Pasos: Aceptar, En Camino y Finalizar\r\n"
            },
            "notifications": true,
            "language": {
                "id": 1,
                "name": "Espa\u00f1ol"
            },
            "welcome_message": "Bienvenido a Delivery al Paso",
            "send_pdf": true,
            "closed_message": "Lo sentimos, por el momento no estamos tomando pedidos. Nuestro horario de atenci\u00f3n es de Viernes a Domingo de 19:30 a 23:30.\nSi escribiste dentro del horario es posible que nos encontremos con mucha demanda.",
            "billingPlan": {
                "id": 4,
                "name": "Testing",
                "created_at": "2023-12-15T12:55:09+00:00"
            },
            "deliveryMethod": null,
            "delivery_paused": false,
            "alternative_currency": null,
            "exchange_rate": null,
            "min_amount_delivery": null,
            "closed_paused": false,
            "closed_paused_message": "Lo sentimos, por el momento no estamos tomando pedidos. Nuestro horario de atenci\u00f3n es de Viernes a Domingo de 19:30 a 23:30.",
            "new_method": false,
            "close_orders_automatically": false,
            "ask_min_amount_delivery": null,
            "whatsapp": [],
            "default_virtual_assistant": 133,
            "store_categories": [
                {
                    "id": 3,
                    "name": "Hamburgueser\u00eda",
                    "description": null
                }
            ],
            "faqs": [
                {
                    "id": 33,
                    "question": "\u00bfTrabajas con Billetera Santa Fe? \u00bfTe puedo pagar con Billetera?",
                    "answer": "No aceptamos pagos con Billetera Santa Fe"
                },
                {
                    "id": 48,
                    "question": "\u00bfse puede agregar cheddar a las papas del combo? \u00bfSe puede modificar el combi? \u00bfLe podes poner cheddar a las papas del combo? ",
                    "answer": "Los combos se venden como se ofrece, si queres agregado de cheddar se pide una bandeja aparte"
                },
                {
                    "id": 423,
                    "question": "Qu\u00e9 aderezos ten\u00e9s?",
                    "answer": "Mayonesa, salsa barbacoa, salsa cheddar, salsa parmesano, salsa criolla, salsa roquefort, chimi, ketchup mostaza"
                }
            ],
            "billingPlanHistories": [
                {
                    "id": 78,
                    "billingPlan": {
                        "id": 4,
                        "name": "Testing",
                        "created_at": "2023-12-15T12:55:09+00:00"
                    },
                    "created_at": "2024-02-27T15:35:44+00:00"
                }
            ],
            "resume_observation": "",
            "created_at": "2023-11-24T10:24:00+00:00",
            "created_by": {
                "id": 1,
                "email": "admin@vici.la",
                "name": "Admin",
                "surname": "VICI",
                "state": {
                    "id": 2,
                    "name": "Active",
                    "created_at": "2023-11-13T10:31:46+00:00",
                    "stateId": 2
                },
                "created_at": "2023-08-03T15:35:52+00:00",
                "created_by": null,
                "updated_at": null,
                "updated_by": null,
                "storeUsers": [],
                "userRoles": [
                    "ROLE_ADMIN"
                ]
            },
            "updated_at": "2024-07-16T16:06:58+00:00",
            "updated_by": {
                "id": 125,
                "email": "ignacio.machado@vici.la",
                "name": "Ignacio",
                "surname": "Machado",
                "state": {
                    "id": 242,
                    "name": "Active",
                    "created_at": "2024-05-06T16:42:20+00:00",
                    "stateId": 2
                },
                "created_at": "2024-03-26T20:10:09+00:00",
                "created_by": {
                    "id": 1,
                    "email": "admin@vici.la",
                    "name": "Admin",
                    "surname": "VICI",
                    "state": {
                        "id": 2,
                        "name": "Active",
                        "created_at": "2023-11-13T10:31:46+00:00",
                        "stateId": 2
                    },
                    "created_at": "2023-08-03T15:35:52+00:00",
                    "created_by": null,
                    "updated_at": null,
                    "updated_by": null,
                    "storeUsers": [],
                    "userRoles": [
                        "ROLE_ADMIN"
                    ]
                },
                "updated_at": null,
                "updated_by": {
                    "id": 1,
                    "email": "admin@vici.la",
                    "name": "Admin",
                    "surname": "VICI",
                    "state": {
                        "id": 2,
                        "name": "Active",
                        "created_at": "2023-11-13T10:31:46+00:00",
                        "stateId": 2
                    },
                    "created_at": "2023-08-03T15:35:52+00:00",
                    "created_by": null,
                    "updated_at": null,
                    "updated_by": null,
                    "storeUsers": [],
                    "userRoles": [
                        "ROLE_ADMIN"
                    ]
                },
                "storeUsers": [
                    {
                        "id": 370,
                        "store": {
                            "id": 24,
                            "name": "Helader\u00eda Los Amores camb2o",
                            "schedules_text": "Lunes a Jueves de 11 a 01:00 hs  - Delivery hasta 00:30hs\nViernes y S\u00e1bado de 12 a 2 hs  - Delivery hasta 00:30hs\nDomingo de 11 a 01:00 hs - Delivery hasta 00:30hs",
                            "waiting_time": "30",
                            "delivery_fee": 800,
                            "address": {
                                "id": 117,
                                "street": "Colon hola",
                                "houseNumber": "236545",
                                "city": {
                                    "id": 10,
                                    "name": "Tres Arroyos",
                                    "province": "\/api\/provinces\/1",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 1,
                                "name": "Peso Argentino",
                                "symbol": "$",
                                "abbreviation": "ARS"
                            },
                            "state": {
                                "id": 2377,
                                "name": "Open",
                                "created_at": "2024-04-22T20:39:56+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 49,
                                    "name": "Cash",
                                    "description": "PESO RIOJANO",
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": true,
                                    "takeaway": false
                                },
                                {
                                    "cbu": "Enviar dinero a losamores.3a y luego enviar comprobante",
                                    "class": "payement-method-wire-transfer",
                                    "id": 51,
                                    "name": "Wire Transfer",
                                    "enterprise": "Transferencia bancaria",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "Enviar dinero al N\u00b0 de documento: 23.887.772  a nombre de Christian Mc Coubrey",
                                    "class": "payement-method-wire-transfer",
                                    "id": 52,
                                    "name": "Wire Transfer",
                                    "enterprise": "Cuenta DNI",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 333,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": false
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 334,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 335,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.modo",
                                    "class": "payement-method-wire-transfer",
                                    "id": 336,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 337,
                                    "name": "Cash",
                                    "description": "PESO MEXICANO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.2",
                                    "class": "payement-method-wire-transfer",
                                    "id": 338,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO2",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 340,
                                    "name": "Cash",
                                    "description": "PESO CHILENO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 341,
                                    "name": "Cash",
                                    "description": "PESO URUGUAYO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 342,
                                    "name": "Cash",
                                    "description": "SOL PERUANO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 343,
                                    "name": "Cash",
                                    "description": "Peso Tucumano",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 344,
                                    "name": "Cash",
                                    "description": "Sol Peruano",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 345,
                                    "name": "Cash",
                                    "description": "PESO COLOMBIANO",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": false
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 346,
                                    "name": "Cash",
                                    "description": "PESO SUDACA",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 347,
                                    "name": "Cash",
                                    "description": "Peso Japon\u00e9s",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": false
                                },
                                {
                                    "class": "payement-method-debit-card",
                                    "id": 348,
                                    "name": "Debit Card",
                                    "enterprise": "FRANCES",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "los.amores.bna",
                                    "class": "payement-method-wire-transfer",
                                    "id": 349,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO BNA+",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": false,
                                    "takeaway": true
                                },
                                {
                                    "link": "http:\/\/link.pago",
                                    "class": "payement-method-link-button",
                                    "id": 352,
                                    "name": "Link Button",
                                    "enterprise": "VICI",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "El costo de env\u00edo es de $800 dentro de los caminos de cintura  y la ruta 3.\nFuera de los caminos de cintura y ruta 3, el costo del env\u00edo es de $1100\nEl costo del env\u00edo en la zona de quintas es de $1500\n",
                            "orderStateWorkflow": {
                                "id": 2,
                                "name": "Large",
                                "description": "3 Pasos: Aceptar, En Camino y Finalizar\r\n"
                            },
                            "notifications": true,
                            "language": {
                                "id": 1,
                                "name": "Espa\u00f1ol"
                            },
                            "welcome_message": "Los precios vigentes son: \n1\/4 $2.800\n1\/2 $4.900\n1kg $7.900\nPromo de 2kg $14.000\n\nSi pedis para retirar en el local y no lo abonas por transferencia, armaremos el pedido cuando pases a retirarlo.\n\nDelivery hasta 00:30hs:\n- Costo de env\u00edo $800\n- Fuera de zona $1100\n- Zona Quinta $1500",
                            "send_pdf": true,
                            "closed_message": "\u00a1Hola! ? En este momento no estamos tomando pedidos, nuestro servicio de delivery es de 12:00 a 16:00hs y de 20 a 00.30. \u00a1Gracias! ?",
                            "billingPlan": {
                                "id": 3,
                                "name": "Activo",
                                "created_at": "2023-12-15T04:58:00+00:00"
                            },
                            "deliveryMethod": {
                                "id": 8,
                                "price": null,
                                "delivery_zone": null,
                                "created_at": "2024-04-29T19:36:03+00:00",
                                "class": "delivery-method-variable",
                                "reason": "",
                                "deliveryZones": [
                                    {
                                        "id": 14,
                                        "name": "laguna",
                                        "description": "\u00f1agp!",
                                        "price": 1500,
                                        "active": true
                                    },
                                    {
                                        "id": 15,
                                        "name": "Centro",
                                        "description": "zona centro",
                                        "price": 1000,
                                        "active": true
                                    }
                                ]
                            },
                            "delivery_paused": null,
                            "alternative_currency": {
                                "id": 2,
                                "name": "Dolar Estadounidense",
                                "symbol": "U$D",
                                "abbreviation": "D\u00f3lar"
                            },
                            "exchange_rate": 1050,
                            "min_amount_delivery": 3553,
                            "closed_paused": false,
                            "closed_paused_message": "",
                            "new_method": null,
                            "close_orders_automatically": null,
                            "ask_min_amount_delivery": null,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 8,
                                    "name": "Bar",
                                    "description": "Ofrece distintas opciones para desayunar \u00f3 merendar, opciones saludables y nutritivas como as\u00ed tambi\u00e9n opciones para los amantes de sabores mas dulces. No requiere reservas, es atendido exclusivamente por sus due\u00f1os"
                                },
                                {
                                    "id": 9,
                                    "name": "Helader\u00eda",
                                    "description": "Las Helader\u00edas son comercios que venden helados y postres. Los cuales el cliente puede y debe escoger gustos de helado, dependiendo del tama\u00f1o que escoja, seleccionar\u00e1 m\u00e1s o menos gustos. "
                                }
                            ],
                            "faqs": [
                                {
                                    "id": 111,
                                    "question": "Cuales sabores son SIN TACC o para cel\u00edacos?",
                                    "answer": "Los siguientes sabores son SIN TACC o para cel\u00edacos: Chocolate, Chocolate Amargo, Sambay\u00f3n, DDL, DDL Granizado, Bananita Dolca, Granizado, Vainilla, Menta Granizada, Crema Americana, Banana Split, Cereza a la Crema, Frutilla a la Crema, Anan\u00e1, Durazno, Fr"
                                },
                                {
                                    "id": 112,
                                    "question": "Me pasar\u00edas los sabores\/gustos?",
                                    "answer": "Claro! Ac\u00e1 te mando la foto con todos los sabores."
                                }
                            ],
                            "billingPlanHistories": [],
                            "resume_observation": "",
                            "created_at": "2023-11-29T14:17:28+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-05-03T12:15:28+00:00",
                            "updated_by": {
                                "id": 28,
                                "email": "Crmccoubrey@gmail.com",
                                "name": "Christian",
                                "surname": "Mccoubrey",
                                "state": {
                                    "id": 63,
                                    "name": "Active",
                                    "created_at": "2023-11-29T14:21:00+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-11-29T14:20:50+00:00",
                                "created_by": {
                                    "id": 1,
                                    "email": "admin@vici.la",
                                    "name": "Admin",
                                    "surname": "VICI",
                                    "state": {
                                        "id": 2,
                                        "name": "Active",
                                        "created_at": "2023-11-13T10:31:46+00:00",
                                        "stateId": 2
                                    },
                                    "created_at": "2023-08-03T15:35:52+00:00",
                                    "created_by": null,
                                    "updated_at": null,
                                    "updated_by": null,
                                    "storeUsers": [],
                                    "userRoles": [
                                        "ROLE_ADMIN"
                                    ]
                                },
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [
                                    {
                                        "id": 33,
                                        "store": "\/api\/stores"
                                    }
                                ],
                                "userRoles": [
                                    "ROLE_ADMIN_TIENDA"
                                ]
                            },
                            "hasChannelConnected": true,
                            "channelsList": [
                                {
                                    "id": 344,
                                    "name": "WhatsappJS",
                                    "whatsapp_status": "Disconnected",
                                    "username": "542216738074",
                                    "bot_status": "Paused"
                                },
                                {
                                    "id": 392,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-5",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 393,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-6",
                                    "bot_status": "Active"
                                },
                                {
                                    "id": 394,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-7",
                                    "bot_status": "Active"
                                },
                                {
                                    "id": 395,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-8",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 401,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Connected",
                                    "username": "Helader\u00eda Los Amores camb2o-9",
                                    "bot_status": "Active"
                                },
                                {
                                    "id": 403,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "Helader\u00eda Los Amores camb2o-10",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 404,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Disconnected",
                                    "username": "Helader\u00eda Los Amores camb2o-11",
                                    "bot_status": "Paused"
                                },
                                {
                                    "id": 428,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Disconnected",
                                    "username": "Helader\u00eda Los Amores camb2o-12",
                                    "bot_status": "Paused"
                                }
                            ],
                            "channelCount": 12
                        }
                    },
                    {
                        "id": 371,
                        "store": {
                            "id": 26,
                            "name": "Caryco",
                            "schedules_text": "Lunes, Mi\u00e9rcoles, Jueves, Viernes 9.30 a 13.30 - 19 a 23\nS\u00e1bado y Domingo 10 a 14 y 19 a 23",
                            "waiting_time": "15",
                            "delivery_fee": 0,
                            "address": {
                                "id": 124,
                                "street": "Alvear",
                                "houseNumber": "1404",
                                "city": {
                                    "id": 3,
                                    "name": "Venado Tuerto",
                                    "province": "\/api\/provinces\/5",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 1,
                                "name": "Peso Argentino",
                                "symbol": "$",
                                "abbreviation": "ARS"
                            },
                            "state": {
                                "id": 2338,
                                "name": "Open",
                                "created_at": "2024-03-23T22:00:19+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 53,
                                    "name": "Cash",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "No recibimos transferencias. Solo pagos en efectivo y tarjeta en el local. Puedes realizar el pago con tarjeta de d\u00e9bito cuando el pedido sea para retiro en el local.",
                                    "class": "payement-method-wire-transfer",
                                    "id": 59,
                                    "name": "Wire Transfer",
                                    "enterprise": "D\u00e9bito",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "Se enviar\u00e1 el QR al finalizar su pedido",
                                    "class": "payement-method-wire-transfer",
                                    "id": 117,
                                    "name": "Wire Transfer",
                                    "enterprise": "QR",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "111111122222",
                                    "class": "payement-method-wire-transfer",
                                    "id": 355,
                                    "name": "Wire Transfer",
                                    "enterprise": "MODO",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "Venado Tuerto",
                            "orderStateWorkflow": {
                                "id": 1,
                                "name": "Medium",
                                "description": "2 Pasos: Aceptar y Finalizar"
                            },
                            "notifications": false,
                            "language": {
                                "id": 1,
                                "name": "Espa\u00f1ol"
                            },
                            "welcome_message": "Bienvenido a Caryc\u00f3, en que podemos ayudarte hoy? El total del pedido te lo estaremos enviando una vez aceptado. Si tu pedido lo ven\u00eds a buscar al local podes pagar con D\u00e9bito o mediante codigo QR mediante alguna billetera virtual. El costo del delivery tiene un m\u00ednimo de $800 seg\u00fan la zona de entrega. ",
                            "send_pdf": true,
                            "closed_message": "Lo sentimos, en este momento no estamos tomando pedidos.\nLos dias MARTES el local se encuentra cerrado.",
                            "billingPlan": {
                                "id": 3,
                                "name": "Activo",
                                "created_at": "2023-12-15T04:58:00+00:00"
                            },
                            "deliveryMethod": null,
                            "delivery_paused": null,
                            "alternative_currency": null,
                            "exchange_rate": null,
                            "min_amount_delivery": null,
                            "closed_paused": null,
                            "closed_paused_message": "",
                            "new_method": true,
                            "close_orders_automatically": null,
                            "ask_min_amount_delivery": null,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 1,
                                    "name": "Rotiser\u00eda",
                                    "description": null
                                }
                            ],
                            "faqs": [
                                {
                                    "id": 25,
                                    "question": "Reciben pagos con transferencias? Puedo pagar con transferencia?",
                                    "answer": "No, lamentablemente solo recibimos pagos en efectivo. En nuestro local pod\u00e9s pagar con d\u00e9bito o con Codigo Qr mediante cuaquier billetera virtual!"
                                },
                                {
                                    "id": 32,
                                    "question": "\u00bfPuedo pagar con QR? \u00bfMe pasas el c\u00f3digo QR, para pagar?",
                                    "answer": "Si claro, en minutos te estar\u00e9 enviando el QR para poder abonar."
                                },
                                {
                                    "id": 34,
                                    "question": "\u00bfCu\u00e1nto sale el delivery? \u00bfCu\u00e1l es el costo del env\u00edo?",
                                    "answer": "El costo del delivery tiene un m\u00ednimo de $700 seg\u00fan la zona de entrega."
                                },
                                {
                                    "id": 62,
                                    "question": "\u00bfCu\u00e1nto sale X producto?",
                                    "answer": "En breve te indicaremos el precio de ese producto."
                                },
                                {
                                    "id": 63,
                                    "question": "\u00bfCu\u00e1l es el precio de X producto?",
                                    "answer": "En breve te indicaremos el precio de ese producto."
                                }
                            ],
                            "billingPlanHistories": [],
                            "resume_observation": "",
                            "created_at": "2023-11-30T12:17:42+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-04-10T17:32:05+00:00",
                            "updated_by": "\/api\/users",
                            "hasChannelConnected": false,
                            "channelsList": [
                                {
                                    "id": 350,
                                    "name": "WhatsappJS",
                                    "whatsapp_status": "Disconnected",
                                    "username": "54JS-Esmeralda",
                                    "bot_status": "Paused"
                                },
                                {
                                    "id": 351,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "54Baileys-Esmeralda",
                                    "bot_status": "Created"
                                }
                            ],
                            "channelCount": 8
                        }
                    },
                    {
                        "id": 372,
                        "store": "\/api\/stores"
                    },
                    {
                        "id": 373,
                        "store": {
                            "id": 58,
                            "name": "La Burguesita",
                            "schedules_text": "Miercoles, Jueves, Viernes, Sabados, Doimingos y Lunes de 19:00 a 23:00 hs",
                            "waiting_time": "45 min",
                            "delivery_fee": 250,
                            "address": {
                                "id": 1059,
                                "street": "Calle 11 entre 153 y 154",
                                "houseNumber": "2925",
                                "city": {
                                    "id": 22,
                                    "name": "Berisso",
                                    "province": "\/api\/provinces\/1",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 1,
                                "name": "Peso Argentino",
                                "symbol": "$",
                                "abbreviation": "ARS"
                            },
                            "state": {
                                "id": 1122,
                                "name": "Closed",
                                "created_at": "2024-01-27T01:06:06+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 121,
                                    "name": "Cash",
                                    "description": "Pesos Argentinos",
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "cbu": "Te paso el CAROALBER.MP  -   Cuando transferis por favor env\u00edanos el COMPROBANTE para dar curso al pedido ",
                                    "class": "payement-method-wire-transfer",
                                    "id": 135,
                                    "name": "Wire Transfer",
                                    "enterprise": "Mercado Pago",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                },
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 354,
                                    "name": "Cash",
                                    "description": "Dolares",
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": null,
                                    "takeaway": null
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "Desde Calle 38 hasta la calle Genova\nDesde calle 143 hasta la calle Montevideo",
                            "orderStateWorkflow": {
                                "id": 2,
                                "name": "Large",
                                "description": "3 Pasos: Aceptar, En Camino y Finalizar\r\n"
                            },
                            "notifications": false,
                            "language": {
                                "id": 1,
                                "name": "Espa\u00f1ol"
                            },
                            "welcome_message": "\u00a1Bienvenido a la Burguesita!",
                            "send_pdf": true,
                            "closed_message": "Por el momento no estamos tomando pedidos, disculpa!",
                            "billingPlan": {
                                "id": 2,
                                "name": "Periodo de Prueba",
                                "created_at": "2023-12-15T04:57:36+00:00"
                            },
                            "deliveryMethod": {
                                "id": 17,
                                "price": null,
                                "delivery_zone": null,
                                "created_at": "2024-05-20T02:58:37+00:00",
                                "class": "delivery-method-variable",
                                "reason": "",
                                "deliveryZones": [
                                    {
                                        "id": 25,
                                        "name": "La Matanza",
                                        "description": "Zona de la matanza",
                                        "price": 400,
                                        "active": true
                                    }
                                ]
                            },
                            "delivery_paused": null,
                            "alternative_currency": {
                                "id": 2,
                                "name": "Dolar Estadounidense",
                                "symbol": "U$D",
                                "abbreviation": "D\u00f3lar"
                            },
                            "exchange_rate": 0.001,
                            "min_amount_delivery": 5000,
                            "closed_paused": null,
                            "closed_paused_message": "",
                            "new_method": true,
                            "close_orders_automatically": false,
                            "ask_min_amount_delivery": true,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 29,
                                    "name": "Rotiseria Local",
                                    "description": "Este comercio es una rotiseria"
                                }
                            ],
                            "faqs": [],
                            "billingPlanHistories": [
                                {
                                    "id": 2,
                                    "billingPlan": {
                                        "id": 1,
                                        "name": "Onboarding",
                                        "created_at": "2023-12-15T04:57:26+00:00"
                                    },
                                    "created_at": "2024-01-04T18:28:23+00:00"
                                }
                            ],
                            "resume_observation": "",
                            "created_at": "2024-01-04T18:28:23+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-05-06T11:50:54+00:00",
                            "updated_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "hasChannelConnected": false,
                            "channelsList": [
                                {
                                    "id": 399,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "54AlonBYS",
                                    "bot_status": "Created"
                                },
                                {
                                    "id": 400,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Initializing",
                                    "username": "54prueba-alonso",
                                    "bot_status": "Created"
                                }
                            ],
                            "channelCount": 5
                        }
                    },
                    {
                        "id": 374,
                        "store": {
                            "id": 92,
                            "name": "Pizzeria El Molino Platense",
                            "schedules_text": "Lunes a Sabado de 11:30 a 14:00 y de 19:30 a 23:00\nDomingo de 19:30 a 23:00 HORARIO ARGENTINA",
                            "waiting_time": "15",
                            "delivery_fee": 600,
                            "address": {
                                "id": 3920,
                                "street": "4735",
                                "houseNumber": "15851",
                                "city": {
                                    "id": 9,
                                    "name": "Junin",
                                    "province": "\/api\/provinces\/1",
                                    "utc": -3,
                                    "utc_name": null
                                },
                                "details": null
                            },
                            "currency": {
                                "id": 4,
                                "name": "Peso Mexicano",
                                "symbol": "$",
                                "abbreviation": "MXN"
                            },
                            "state": {
                                "id": 2374,
                                "name": "Open",
                                "created_at": "2024-04-11T17:06:51+00:00"
                            },
                            "paymentMethods": [
                                {
                                    "enterprise": "",
                                    "class": "payement-method-cash",
                                    "id": 235,
                                    "name": "Cash",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": true,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "El Alias para transferencia es JORGELINA.OVIEDO  -  a nombre de Jorgelina Grisel Oviedo - Por favor enviar comprobante",
                                    "class": "payement-method-wire-transfer",
                                    "id": 236,
                                    "name": "Wire Transfer",
                                    "enterprise": "Mercado Pago",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                },
                                {
                                    "cbu": "El Alias para cuenta DNI es JORGELINAOVIEDO.DNI - a nombre de Jorgelina Grisel Oviedo - Por Favor enviar el comprobante",
                                    "class": "payement-method-wire-transfer",
                                    "id": 251,
                                    "name": "Wire Transfer",
                                    "enterprise": "Cuenta DNI",
                                    "description": null,
                                    "active": true,
                                    "defaultOption": false,
                                    "delivery": true,
                                    "takeaway": true
                                }
                            ],
                            "type": {
                                "id": 1,
                                "name": "Food Store"
                            },
                            "delivery": true,
                            "takeaway": true,
                            "delivery_zone": "City Bell - Villa Castels - Villa Elisa",
                            "orderStateWorkflow": {
                                "id": 1,
                                "name": "Medium",
                                "description": "2 Pasos: Aceptar y Finalizar"
                            },
                            "notifications": false,
                            "language": {
                                "id": 3,
                                "name": "Portugu\u00e9s"
                            },
                            "welcome_message": "welcome cari\u00f1ooo o",
                            "send_pdf": true,
                            "closed_message": "",
                            "billingPlan": {
                                "id": 2,
                                "name": "Periodo de Prueba",
                                "created_at": "2023-12-15T04:57:36+00:00"
                            },
                            "deliveryMethod": {
                                "id": 7,
                                "price": null,
                                "delivery_zone": null,
                                "created_at": "2024-04-29T14:48:15+00:00",
                                "class": "delivery-method-variable",
                                "reason": "",
                                "deliveryZones": [
                                    {
                                        "id": 12,
                                        "name": "juan",
                                        "description": "sdfsdfsdfsdf",
                                        "price": 1275,
                                        "active": true
                                    },
                                    {
                                        "id": 13,
                                        "name": "los hornos ",
                                        "description": "addsdksldsld ",
                                        "price": 777,
                                        "active": true
                                    }
                                ]
                            },
                            "delivery_paused": null,
                            "alternative_currency": null,
                            "exchange_rate": 0,
                            "min_amount_delivery": 0,
                            "closed_paused": false,
                            "closed_paused_message": "En este momento no podemos tomar tu pedido, Disculpa!!",
                            "new_method": null,
                            "close_orders_automatically": false,
                            "ask_min_amount_delivery": false,
                            "whatsapp": [],
                            "default_virtual_assistant": null,
                            "store_categories": [
                                {
                                    "id": 1,
                                    "name": "Rotiser\u00eda",
                                    "description": null
                                },
                                {
                                    "id": 2,
                                    "name": "Pizzeria",
                                    "description": null
                                },
                                {
                                    "id": 3,
                                    "name": "Hamburgueser\u00eda",
                                    "description": null
                                }
                            ],
                            "faqs": [
                                {
                                    "id": 506,
                                    "question": "holu",
                                    "answer": "chaui"
                                }
                            ],
                            "billingPlanHistories": [
                                {
                                    "id": 65,
                                    "billingPlan": {
                                        "id": 1,
                                        "name": "Onboarding",
                                        "created_at": "2023-12-15T04:57:26+00:00"
                                    },
                                    "created_at": "2024-02-19T21:07:08+00:00"
                                },
                                {
                                    "id": 73,
                                    "billingPlan": {
                                        "id": 2,
                                        "name": "Periodo de Prueba",
                                        "created_at": "2023-12-15T04:57:36+00:00"
                                    },
                                    "created_at": "2024-02-24T02:08:23+00:00"
                                }
                            ],
                            "resume_observation": "El costo de env\u00edo puede VARIAR seg\u00fan la Zona, cuidado con lo que pedis! ;) :DD",
                            "created_at": "2024-02-19T21:07:08+00:00",
                            "created_by": {
                                "id": 1,
                                "email": "admin@vici.la",
                                "name": "Admin",
                                "surname": "VICI",
                                "state": {
                                    "id": 2,
                                    "name": "Active",
                                    "created_at": "2023-11-13T10:31:46+00:00",
                                    "stateId": 2
                                },
                                "created_at": "2023-08-03T15:35:52+00:00",
                                "created_by": null,
                                "updated_at": null,
                                "updated_by": null,
                                "storeUsers": [],
                                "userRoles": [
                                    "ROLE_ADMIN"
                                ]
                            },
                            "updated_at": "2024-07-04T13:48:59+00:00",
                            "updated_by": "\/api\/users",
                            "hasChannelConnected": true,
                            "channelsList": [
                                {
                                    "id": 468,
                                    "name": "WhatsappBaileys",
                                    "whatsapp_status": "Connected",
                                    "username": "5492215440652",
                                    "bot_status": "Active"
                                }
                            ],
                            "channelCount": 7
                        }
                    }
                ],
                "userRoles": [
                    "ROLE_ADMIN_TIENDA",
                    "ROLE_ORDERS_CONVERSATIONS"
                ]
            },
            "hasChannelConnected": true,
            "channelsList": [
                {
                    "id": 469,
                    "name": "WhatsappBaileys",
                    "whatsapp_status": "Connected",
                    "username": "5492216955750",
                    "bot_status": "Active"
                },
                {
                    "id": 472,
                    "name": "WhatsappBaileys",
                    "whatsapp_status": "Disconnected",
                    "username": "Delivery al Paso-29",
                    "bot_status": "Created"
                }
            ],
            "channelCount": 29
        },
        "basePath": "\/api\/whatsapps-baileys",
        "basePathTest": "\/api\/whatsapps-baileys\/test",
        "qrCode": "2@MZ3GCKSxh+qpCSgvwSdAFOGhYkv\/bLAjcgDwki2TLs4EDZ0axr3De0NLMs1bSP8sH6Atx3eTu2aQQg==,AZyI6L8j3OuxriwQ\/Vjcb3CmOXhoVA7t+481ceCSGl4=,nKX7R6a1hEft\/UugYKSUhIFYK\/QnhPusZN1td0sQHy4=,H1O3lDP9npYT8Z15Y8t00AsCv3\/bhoR+xAABS8ws3jo=",
        "actualStatus": {
            "id": 12928,
            "name": "Disconnected"
        },
        "id": 472,
        "username": "Delivery al Paso-29",
        "state": {
            "id": 12618,
            "name": "Created",
            "created_at": "2024-07-23T14:18:40+00:00",
            "stateId": 1
        },
        "created_at": "2024-07-23T14:18:40+00:00",
        "updated_by": null,
        "updated_at": null,
        "virtualAssistant": {
            "id": 133,
            "name": "Langchain"
        },
        "channelName": "WhatsappBaileys",
        "conversationsCount": 0
    }
]
const InstanceDataProvider: React.FC<any> = ({
  children,
}) => {
  // const { addToast } = useToast();
  // const { request } = useFetch();
  const [instances] = useState<any[]>(dummyInstancesArray);

  // useEffect(() => onGetProducts(), []);

  return children({ instances });
};

export default InstanceDataProvider;
