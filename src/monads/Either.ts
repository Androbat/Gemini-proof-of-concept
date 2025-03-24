
// https://sheldonreay.com/posts/implementation-either-monad-typescript/
// https://kkalamarski.me/how-to-write-a-more-declarative-typescript-code-maybe-monad-implementation
// Either Monad:
class Either<L, R> {
    private constructor(private left: L, private right: R) { }

    static right<R>(value: R): Either<any, R> {
        return new Either(null, value);
    }

    static left<L>(value: L): Either<L, any> {
        return new Either(value, null);
    }

    isRight() {
        return this.right;
    }

    isLeft() {
        return this.left;
    }

    mapRight<R2>(f: (wrapped: R) => R2): Either<L, R2> {
        if (this.isRight()) {
            return Either.right(f(this.right));
        }
        return Either.left(this.left);
    }

    mapLeft<L2>(f: (wrapped: L) => L2): Either<L2, R> {
        if (this.isLeft()) {
            return Either.left(f(this.left))
        }

        return Either.right(this.right);
    }

    flatMap<R2>(f: (wrapped: R) => Either<L, R2>): Either<L, R2> {
        return this.chain(f);
    }

    chain<R2>(f: (wrapped: R) => Either<L, R2>): Either<L, R2> {
        if (this.isRight()) {
            return f(this.right);
        }

        return Either.left(this.left);
    }

    static catch<R2>(fn: () => R2): Either<any, R2> {
        try {
            return Either.right(fn());
        } catch (expectionError) {
            return Either.left(expectionError)
        }
    }
}

// Test
const result = Either.right({ name: "John", age: 30 });
const mapped = result.chain((wrapped) => Either.right(wrapped.age))
                     .chain((wrapped) => Either.right(wrapped + 1));

// console.log(result);
// console.log(mapped);

// EITHER MONAD:
// The either Monad is mainly  used to handle errors in opeartions:
// Left -> Error
// Right -> Success case

// Map function:
// * It's a function that takes out another function
// * If it is the right value, then take the function
// * and pass to the function the right value,
// * Otherwise just return the left one to me.

