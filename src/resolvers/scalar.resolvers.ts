import { GraphQLScalarType } from "graphql";

const dateScalar = {
    Date:  new GraphQLScalarType({
        name: 'Date',
        parseValue(value){
            if (typeof value === 'number' || typeof value === 'string') {
                return new Date(value); 
            }
            throw new Error('date scalar parser expected a number or string');
        },
        serialize(value) {
            if (value instanceof Date) {
                return value.toISOString();
            }
            throw Error('date scalar serializer expected a Date');
        },
    })
}

export default dateScalar;