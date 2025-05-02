import { Server } from "http";
import app from "./app";

const PORT = process.env.PORT || 5000;

async function main() {
  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
