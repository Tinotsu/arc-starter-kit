import type { InferData, InferVariants } from '@adonisjs/core/types/transformers'
import type IdentityTransformersUserTransformer from '#app/identity/transformers/user_transformer'

export namespace Data {
  export namespace Identity {
    export namespace Transformers {
      export type User = InferData<IdentityTransformersUserTransformer>
      export namespace User {
        export type Variants = InferVariants<IdentityTransformersUserTransformer>
      }
    }
  }
}
