# GraphQL Subscription test(sandbox) ruby client

It's small test(sandbox) setup for graphql subscription when you use it with  

`gem 'graphql'`  

**Change urls in `src/index.js` to your endpoints**  

To run example:  
`npm install`  
`npm start`

trigger from Rails console example:  
`BackendSchema.subscriptions.trigger(:hello, {}, 'test')`  
just mention configs that probably can save you time

```ruby
# app/graphql/backend_schema.rb

class BackendSchema < GraphQL::Schema
  # Assume that use ActionCable
  use GraphQL::Subscriptions::ActionCableSubscriptions, redis: Redis.new
  subscription(Types::SubscriptionType)
  # remove other configs to not to distract attention
end
```

```ruby
# app/graphql/types/subscription_type.rb
module Types
  class SubscriptionType < Types::BaseObject
    field :hello, String, null: false

    def hello
      'hello'
    end
  end
end
```

```ruby
# config/environments/development.rb

config.action_cable.allowed_request_origins = [/http:\/\/*/, /https:\/\/*/, /file:\/\/*/, 'file://']
```

```ruby
# config/application.rb

if Rails.env.test? || Rails.env.development?
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "*"
      resource "*", headers: :any, methods: [:get, :post, :options, :patch, :put, :delete]
    end
  end
end
```

[WARN] this line below put only in development mode with ActionCable
```ruby
# config/routes.rb

mount ActionCable.server, at: '/cable'
```
