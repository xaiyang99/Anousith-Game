import "./App.css";
import Routes from "./routes";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

function App() {
  const client = new ApolloClient({
    uri: "https://server-info.anousith-express.com/",
    // uri: "http://localhost:7070/",
    request: (operation) => {
      const _resData = localStorage.getItem("ANOUSITH_GAME");
      const _localJson = JSON.parse(_resData);
      if (_localJson) {
        operation.setContext({
          headers: {
            authorization: _localJson?.accessToken,
          },
        });
        return;
      }
    },
  });
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
