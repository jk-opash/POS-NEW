import { io } from "socket.io-client";

class SocketService {
  socket = null;

  connect(branchId, token) {
    if (this.socket) {
      if (this.socket.connected) return;
      this.socket.disconnect();
    }

    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL ||
      "https://pos-backend-qcky.onrender.com/api";
    // const apiUrl =
    //   process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api";
    const socketUrl = apiUrl.replace("/api", "");

    this.socket = io(socketUrl, {
      query: { branchId },
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 10,
    });

    this.socket.on("connect", () => {
      console.log(`✅ Socket connected to branch_${branchId}`);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
