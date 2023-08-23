const { Server } = require('socket.io')

const ProductManagerMongo = require('../dao/ProductManagerMongo')
const MessageManagerMongo = require('../dao/MessageManagerMongo')
const moment = require('moment');

const init = (httpServer) => {
  const io = new Server(httpServer)

  const productManagerMongo = new ProductManagerMongo(io)
  const messageManagerMongo = new MessageManagerMongo(io)

  io.on('connection', socket => {
    console.log('Nuevo cliente conectado', socket.id)

    socket.on('addProduct', async productData => {
      const product = JSON.parse(productData);
      try {
        await productManagerMongo.addProduct(product);
        socket.emit('notification', 'El producto fue agregado con éxito');
      } catch (error) {
        socket.emit('notification', error.message)
      }
    });

    socket.on('updateProduct', async (productId, data) => {
      try {
        await productManagerMongo.updateProduct(productId, data);
        socket.emit('notification', 'El producto fue actualizado exitósamente');
      } catch (error) {
        socket.emit('notification', error.message);
      }
    });

    socket.on('deleteProduct', async productId => {
      try {
        await productManagerMongo.deleteProduct(productId);
        socket.emit('notification', 'El producto fue borrado con éxito');
      } catch (error) {
        socket.emit('notification', error.message)
      }
    });

    socket.on('joinChat', async (newUser) => {
      try {
        socket.broadcast.emit('notification', `Un nuevo usuario ${newUser} se unió al chat`);

        const messages = await messageManagerMongo.getMessages();

        const formattedMessages = messages.map((message) => ({
          ...message,
          formattedTimestamp: moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
        }));

        socket.emit('printPreviousMessages', formattedMessages);
      } catch (error) {
        socket.emit('notification', error.message);
      }
    });

    socket.on('newMessage', async ({ user, message }) => {
      try {
        const newMessage = await messageManagerMongo.addMessage(user, message);
        socket.broadcast.emit('notification', `Hay un nuevo mensaje de ${user}`);

        io.emit('printNewMessage', {
          user: newMessage.user,
          content: newMessage.content,
          timestamp: moment(newMessage.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
        });

      } catch (error) {
        socket.emit('notification', error.message);
      }
    });

  })

  return io
}

module.exports = init