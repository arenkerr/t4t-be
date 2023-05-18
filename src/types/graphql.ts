import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type BaseError = {
  message: Scalars['String'];
};

export type CreateUserResult = UnknownError | User;

export type InvalidCredentialsError = BaseError & {
  __typename?: 'InvalidCredentialsError';
  message: Scalars['String'];
};

export type InvalidInputError = BaseError & {
  __typename?: 'InvalidInputError';
  message: Scalars['String'];
};

export type LoginResult = InvalidCredentialsError | LoginToken | UnknownError;

export type LoginToken = {
  __typename?: 'LoginToken';
  token: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: CreateUserResult;
  login: LoginResult;
};


export type MutationCreateUserArgs = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type NotAllowedError = BaseError & {
  __typename?: 'NotAllowedError';
  message: Scalars['String'];
};

export type NotFoundError = BaseError & {
  __typename?: 'NotFoundError';
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<Maybe<User>>>;
};

export type UnknownError = BaseError & {
  __typename?: 'UnknownError';
  message: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['ID'];
  password: Scalars['String'];
  username: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes = {
  CreateUserResult: ( UnknownError ) | ( User );
  LoginResult: ( InvalidCredentialsError ) | ( LoginToken ) | ( UnknownError );
};

/** Mapping of union parent types */
export type ResolversUnionParentTypes = {
  CreateUserResult: ( UnknownError ) | ( User );
  LoginResult: ( InvalidCredentialsError ) | ( LoginToken ) | ( UnknownError );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BaseError: ResolversTypes['InvalidCredentialsError'] | ResolversTypes['InvalidInputError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['NotFoundError'] | ResolversTypes['UnknownError'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateUserResult: ResolverTypeWrapper<ResolversUnionTypes['CreateUserResult']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  InvalidCredentialsError: ResolverTypeWrapper<InvalidCredentialsError>;
  InvalidInputError: ResolverTypeWrapper<InvalidInputError>;
  LoginResult: ResolverTypeWrapper<ResolversUnionTypes['LoginResult']>;
  LoginToken: ResolverTypeWrapper<LoginToken>;
  Mutation: ResolverTypeWrapper<{}>;
  NotAllowedError: ResolverTypeWrapper<NotAllowedError>;
  NotFoundError: ResolverTypeWrapper<NotFoundError>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UnknownError: ResolverTypeWrapper<UnknownError>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BaseError: ResolversParentTypes['InvalidCredentialsError'] | ResolversParentTypes['InvalidInputError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['NotFoundError'] | ResolversParentTypes['UnknownError'];
  Boolean: Scalars['Boolean'];
  CreateUserResult: ResolversUnionParentTypes['CreateUserResult'];
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  InvalidCredentialsError: InvalidCredentialsError;
  InvalidInputError: InvalidInputError;
  LoginResult: ResolversUnionParentTypes['LoginResult'];
  LoginToken: LoginToken;
  Mutation: {};
  NotAllowedError: NotAllowedError;
  NotFoundError: NotFoundError;
  Query: {};
  String: Scalars['String'];
  UnknownError: UnknownError;
  User: User;
};

export type BaseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['BaseError'] = ResolversParentTypes['BaseError']> = {
  __resolveType: TypeResolveFn<'InvalidCredentialsError' | 'InvalidInputError' | 'NotAllowedError' | 'NotFoundError' | 'UnknownError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CreateUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult']> = {
  __resolveType: TypeResolveFn<'UnknownError' | 'User', ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type InvalidCredentialsErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidCredentialsError'] = ResolversParentTypes['InvalidCredentialsError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvalidInputErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidInputError'] = ResolversParentTypes['InvalidInputError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  __resolveType: TypeResolveFn<'InvalidCredentialsError' | 'LoginToken' | 'UnknownError', ParentType, ContextType>;
};

export type LoginTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginToken'] = ResolversParentTypes['LoginToken']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['CreateUserResult'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email' | 'password' | 'username'>>;
  login?: Resolver<ResolversTypes['LoginResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
};

export type NotAllowedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotAllowedError'] = ResolversParentTypes['NotAllowedError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotFoundErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotFoundError'] = ResolversParentTypes['NotFoundError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type UnknownErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnknownError'] = ResolversParentTypes['UnknownError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BaseError?: BaseErrorResolvers<ContextType>;
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  Date?: GraphQLScalarType;
  InvalidCredentialsError?: InvalidCredentialsErrorResolvers<ContextType>;
  InvalidInputError?: InvalidInputErrorResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  LoginToken?: LoginTokenResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotAllowedError?: NotAllowedErrorResolvers<ContextType>;
  NotFoundError?: NotFoundErrorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UnknownError?: UnknownErrorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

