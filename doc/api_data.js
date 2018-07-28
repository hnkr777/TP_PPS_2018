define({ "api": [
  {
    "type": "",
    "url": "Guardar",
    "title": "Encuesta",
    "name": "guardarNuevoEncuesta",
    "group": "Encuesta",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Encuesta",
            "optional": true,
            "field": "nuevo",
            "description": "<p>Encuesta que se guardara en la base</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe una encuesta y la guarda en la base de datos de firestore</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-encuestas/servicio-encuestas.ts",
    "groupTitle": "Encuesta"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "F__Repos_Ionic_TP_PPS_2018_doc_main_js",
    "groupTitle": "F__Repos_Ionic_TP_PPS_2018_doc_main_js",
    "name": ""
  },
  {
    "type": "",
    "url": "Tomar",
    "title": "Foto Libreria",
    "name": "addLibraryPhoto",
    "group": "Fotos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "ruta",
            "description": "<p>La ruta de acceso a la imagen</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "promesa",
            "description": "<p>Devuelve Una promesa luego de guardar la imagen</p>"
          }
        ]
      }
    },
    "description": "<p>Abre La libreria para cargar una foto ya guardada de tu celular</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-fotos/servicio-fotos.ts",
    "groupTitle": "Fotos"
  },
  {
    "type": "",
    "url": "Conversor",
    "title": "de imagen a Binario",
    "name": "getBlob",
    "group": "Fotos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "b64Data",
            "description": "<p>Imagen en Base64 a ser transformada</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Devuelve",
            "description": "<p>la imagen en binario</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe una imagen en base64 y la transforma en binaria</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-fotos/servicio-fotos.ts",
    "groupTitle": "Fotos"
  },
  {
    "type": "",
    "url": "Subir",
    "title": "Imagen",
    "name": "getImageURL",
    "group": "Fotos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "image",
            "description": "<p>Imagen en base64</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "path",
            "description": "<p>Ruta donde guardar la imagen</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Link",
            "description": "<p>de la imagen Subida</p>"
          }
        ]
      }
    },
    "description": "<p>Se encarga de subir a la base la imagen en binario</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-fotos/servicio-fotos.ts",
    "groupTitle": "Fotos"
  },
  {
    "type": "",
    "url": "Obtener",
    "title": "Url de la imagen",
    "name": "getImageURL",
    "group": "Fotos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "path",
            "description": "<p>Ruta de donde deberia buscar la imagen</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Link",
            "description": "<p>de la imagen buscada</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe una ruta y devuelve el link de la imagen buscada</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-fotos/servicio-fotos.ts",
    "groupTitle": "Fotos"
  },
  {
    "type": "",
    "url": "Guardar",
    "title": "Foto",
    "name": "savePhoto",
    "group": "Fotos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "CameraOptions",
            "optional": true,
            "field": "options",
            "description": "<p>Opciones de la camara</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "ruta",
            "description": "<p>La ruta donde guardar la imagen</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "promesa",
            "description": "<p>Devuelve Una promesa luego de guardar la imagen</p>"
          }
        ]
      }
    },
    "description": "<p>Guarda la imagen en la base de datos firestore</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-fotos/servicio-fotos.ts",
    "groupTitle": "Fotos"
  },
  {
    "type": "",
    "url": "Tomar",
    "title": "Foto Camara",
    "name": "takePhoto",
    "group": "Fotos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "ruta",
            "description": "<p>La ruta donde guardar la imagen</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "promesa",
            "description": "<p>Devuelve Una promesa luego de guardar la imagen</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe la ruta donde guarda la imagen y devuelve un promise luego de guardarla</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-fotos/servicio-fotos.ts",
    "groupTitle": "Fotos"
  },
  {
    "type": "",
    "url": "Reproducir",
    "title": "sonido de Click",
    "name": "reproducirClick",
    "group": "Sonidos",
    "description": "<p>Reproduce un sonido de click en la app</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-audio/servicio-audio.ts",
    "groupTitle": "Sonidos"
  },
  {
    "type": "",
    "url": "Reproducir",
    "title": "sonido de Error",
    "name": "reproducirError",
    "group": "Sonidos",
    "description": "<p>Reproduce un sonido de Error en la app</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-audio/servicio-audio.ts",
    "groupTitle": "Sonidos"
  },
  {
    "type": "",
    "url": "Reproducir",
    "title": "sonido de Exito",
    "name": "reproducirExito",
    "group": "Sonidos",
    "description": "<p>Reproduce un sonido de Exito en la app</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-audio/servicio-audio.ts",
    "groupTitle": "Sonidos"
  },
  {
    "type": "",
    "url": "Reproducir",
    "title": "sonido de Inicio",
    "name": "reproducirInicio",
    "group": "Sonidos",
    "description": "<p>Reproduce un sonido de Inicio en la app</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-audio/servicio-audio.ts",
    "groupTitle": "Sonidos"
  },
  {
    "type": "",
    "url": "Guardar",
    "title": "GuardarUsuario",
    "name": "guardarNuevoUsuario",
    "group": "Usuarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Usuario",
            "optional": true,
            "field": "nuevo",
            "description": "<p>Usuario a guardar en la base</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Una",
            "description": "<p>Promesa Junto con los datos de respuesta de la base</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe un usuario y lo guarda en la base datos, luego devuelve una promesa.</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-usuarios/servicio-usuarios.ts",
    "groupTitle": "Usuarios"
  },
  {
    "type": "",
    "url": "Modificar",
    "title": "ModificarUsuario",
    "name": "modificarUsuario",
    "group": "Usuarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Usuario",
            "optional": true,
            "field": "usuario",
            "description": "<p>Usuario modificado</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe un usuario modificado y lo sube a la base remplazando al anterior que use le mismo correo.</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-usuarios/servicio-usuarios.ts",
    "groupTitle": "Usuarios"
  },
  {
    "type": "",
    "url": "Usuario",
    "title": "Traer Por Correo",
    "name": "traerUsuarioPorEmail",
    "group": "Usuarios",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "correo",
            "description": "<p>correo a buscar en la base</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "El",
            "description": "<p>usuario encontrado junto con una promesa</p>"
          }
        ]
      }
    },
    "description": "<p>Trae un usuario de la base de datos segun un email y los devuelve junto con una promesa</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-usuarios/servicio-usuarios.ts",
    "groupTitle": "Usuarios"
  },
  {
    "type": "",
    "url": "Traer",
    "title": "Todos Los usuarios",
    "name": "traerUsuarios",
    "group": "Usuarios",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Todos",
            "description": "<p>los usuarios junto con una promesa</p>"
          }
        ]
      }
    },
    "description": "<p>Trae Todos los usuarios de la base de datos y los devuelve junto con una promesa</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-usuarios/servicio-usuarios.ts",
    "groupTitle": "Usuarios"
  },
  {
    "type": "",
    "url": "Traer",
    "title": "Todos Los usuarios Por Perfil",
    "name": "traerUsuariosPorPerfil",
    "group": "Usuarios",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Todos",
            "description": "<p>los usuarios junto con una promesa</p>"
          }
        ]
      }
    },
    "description": "<p>Trae Todos los usuarios de la base de datos segun su perfil (chofer,cliente o supervisor) y los devuelve junto con una promesa</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-usuarios/servicio-usuarios.ts",
    "groupTitle": "Usuarios"
  },
  {
    "type": "",
    "url": "Cambiar",
    "title": "El Estado Al Vehiculo",
    "name": "cambiarEstadoVehiculoPorPatente",
    "group": "Vehiculos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "patente",
            "description": "<p>Patente a buscar</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "estado",
            "description": "<p>Numero del estado</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe un Estado y busca por patente al vehiculo para cambiarlo de estado</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-vehiculo/servicio-vehiculo.ts",
    "groupTitle": "Vehiculos"
  },
  {
    "type": "",
    "url": "Modificar",
    "title": "Vehiculo",
    "name": "modificarVehiculo",
    "group": "Vehiculos",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Vehiculo",
            "optional": true,
            "field": "vehiculo",
            "description": "<p>Vehiculo Modificado</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe un vehiculo y lo guarda remplazando su original buscandolo por la patente</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-vehiculo/servicio-vehiculo.ts",
    "groupTitle": "Vehiculos"
  },
  {
    "type": "",
    "url": "Traer",
    "title": "Todos Los Vehiculos",
    "name": "traerVehiculos",
    "group": "Vehiculos",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Una",
            "description": "<p>Promesa Junto con los datos de respuesta de la base</p>"
          }
        ]
      }
    },
    "description": "<p>Devuelve todos los vehiculos en la base junto con una promesa</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-vehiculo/servicio-vehiculo.ts",
    "groupTitle": "Vehiculos"
  },
  {
    "type": "",
    "url": "Transformar",
    "title": "Direccion en Lat y Lng",
    "name": "geoCoding",
    "group": "Viajes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "direccion",
            "description": "<p>Direccion a transformar</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Una",
            "description": "<p>promesa junto con la respuesta de la api</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe una direccion y la transforma en latitud y longitud</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-viajes/servicio-viajes.ts",
    "groupTitle": "Viajes"
  },
  {
    "type": "",
    "url": "Guardar",
    "title": "Nuevo Viaje",
    "name": "guardarNuevoViaje",
    "group": "Viajes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Viaje",
            "optional": true,
            "field": "nuevo",
            "description": "<p>Viaje a ser guardado</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Promise",
            "optional": false,
            "field": "Una",
            "description": "<p>promesa junto con la respuesta de la base</p>"
          }
        ]
      }
    },
    "description": "<p>Guarda un viaje en la base de datos y devuelve una promesa</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-viajes/servicio-viajes.ts",
    "groupTitle": "Viajes"
  },
  {
    "type": "",
    "url": "Modificar",
    "title": "ModificarViaje",
    "name": "modificarViaje",
    "group": "Viajes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Viaje",
            "optional": true,
            "field": "viaje",
            "description": "<p>Viaje Modificado a guardar</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe un viaje modificado y guarda remplazando el viaje encontrado por la fecha de registro</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-viajes/servicio-viajes.ts",
    "groupTitle": "Viajes"
  },
  {
    "type": "",
    "url": "Traer",
    "title": "Todos Los viajes",
    "name": "traerViajes",
    "group": "Viajes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Observable",
            "optional": false,
            "field": "Un",
            "description": "<p>observable junto con los datos de la base</p>"
          }
        ]
      }
    },
    "description": "<p>Recibe un Estado y busca por patente al vehiculo para cambiarlo de estado</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-viajes/servicio-viajes.ts",
    "groupTitle": "Viajes"
  },
  {
    "type": "",
    "url": "Traer",
    "title": "Todos Los viajes Filtrados",
    "name": "traerViajesFiltrados",
    "group": "Viajes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "campo",
            "description": "<p>Campo a comparar</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "criterio",
            "description": "<p>Criterio de comparacion</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "filtro",
            "description": "<p>Valor con el cual se compara</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Observable",
            "optional": false,
            "field": "Un",
            "description": "<p>observable junto con los datos de la base</p>"
          }
        ]
      }
    },
    "description": "<p>Trae los viajes filtrados segun un criterio</p>",
    "version": "0.0.0",
    "filename": "./src/providers/servicio-viajes/servicio-viajes.ts",
    "groupTitle": "Viajes"
  }
] });
