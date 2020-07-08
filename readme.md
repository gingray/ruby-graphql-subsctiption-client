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
  # other configs removed to not to distract attention
end
```

```ruby
# app/graphql/types/subscription_type.rb
module Types
  class SubscriptionType < Types::BaseObject
    field :notify_display, subscription: Subscription::NotifyDisplay
  end
end
```

```ruby
# app/graphql/subscription/notify_display.rb

module Subscription
  class NotifyDisplay < Subscription::BaseSubscription
    argument :display_id, Int, required: true
    field :message, String, null: true

    def subscribe(display_id:)
      :no_response
    end

    def update(display_id:)
      # where object come from its payload which send
      # thorugh the trigger function
      # https://graphql-ruby.org/subscriptions/triggers.html
      { message: object }
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
