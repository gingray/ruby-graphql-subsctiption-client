import "./style.scss";
import { execute, ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ActionCable from 'actioncable';
import { ActionCableLink } from 'graphql-ruby-client';
import gql from 'graphql-tag';

const cable = ActionCable.createConsumer("ws://lvh.me:4000/cable")

const httpLink = new HttpLink({
    uri: 'http://lvh.me:4000/graphql',
});

const hasSubscriptionOperation = ({ query: { definitions } }) => {
    return definitions.some(
        ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
    )
}

const link = ApolloLink.split(
    hasSubscriptionOperation,
    new ActionCableLink({cable}),
    httpLink
);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

const query = gql`subscription {
    notifyDisplay(displayId: 1) {
        message
    }
}`;

const operation = {
    query: query,
    variables: {}, //optional
};

execute(link, operation).subscribe({
    next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
    error: error => console.log(`received error ${error}`),
    complete: () => console.log(`complete`),
})

console.log("Ruby GraphQL client")
