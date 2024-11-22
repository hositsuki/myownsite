/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface SubscriptionContractInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getSubscriptionEndTime"
      | "isSubscribed"
      | "owner"
      | "subscribe"
      | "subscriptionPrice"
      | "subscriptions"
      | "updatePrice"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "NewSubscription" | "PriceUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "getSubscriptionEndTime",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isSubscribed",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "subscribe", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "subscriptionPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "subscriptions",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getSubscriptionEndTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSubscribed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "subscribe", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "subscriptionPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subscriptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace NewSubscriptionEvent {
  export type InputTuple = [subscriber: AddressLike, endTime: BigNumberish];
  export type OutputTuple = [subscriber: string, endTime: bigint];
  export interface OutputObject {
    subscriber: string;
    endTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PriceUpdatedEvent {
  export type InputTuple = [newPrice: BigNumberish];
  export type OutputTuple = [newPrice: bigint];
  export interface OutputObject {
    newPrice: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SubscriptionContract extends BaseContract {
  connect(runner?: ContractRunner | null): SubscriptionContract;
  waitForDeployment(): Promise<this>;

  interface: SubscriptionContractInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getSubscriptionEndTime: TypedContractMethod<
    [_subscriber: AddressLike],
    [bigint],
    "view"
  >;

  isSubscribed: TypedContractMethod<
    [_subscriber: AddressLike],
    [boolean],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  subscribe: TypedContractMethod<[], [void], "payable">;

  subscriptionPrice: TypedContractMethod<[], [bigint], "view">;

  subscriptions: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  updatePrice: TypedContractMethod<
    [_newPrice: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getSubscriptionEndTime"
  ): TypedContractMethod<[_subscriber: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "isSubscribed"
  ): TypedContractMethod<[_subscriber: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "subscribe"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "subscriptionPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "subscriptions"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "updatePrice"
  ): TypedContractMethod<[_newPrice: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "NewSubscription"
  ): TypedContractEvent<
    NewSubscriptionEvent.InputTuple,
    NewSubscriptionEvent.OutputTuple,
    NewSubscriptionEvent.OutputObject
  >;
  getEvent(
    key: "PriceUpdated"
  ): TypedContractEvent<
    PriceUpdatedEvent.InputTuple,
    PriceUpdatedEvent.OutputTuple,
    PriceUpdatedEvent.OutputObject
  >;

  filters: {
    "NewSubscription(address,uint256)": TypedContractEvent<
      NewSubscriptionEvent.InputTuple,
      NewSubscriptionEvent.OutputTuple,
      NewSubscriptionEvent.OutputObject
    >;
    NewSubscription: TypedContractEvent<
      NewSubscriptionEvent.InputTuple,
      NewSubscriptionEvent.OutputTuple,
      NewSubscriptionEvent.OutputObject
    >;

    "PriceUpdated(uint256)": TypedContractEvent<
      PriceUpdatedEvent.InputTuple,
      PriceUpdatedEvent.OutputTuple,
      PriceUpdatedEvent.OutputObject
    >;
    PriceUpdated: TypedContractEvent<
      PriceUpdatedEvent.InputTuple,
      PriceUpdatedEvent.OutputTuple,
      PriceUpdatedEvent.OutputObject
    >;
  };
}
