<template>
    <div class="authorization">
        <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(submit)">
                <div class="filed">
                    <ValidationProvider name="用户名" rules="required" v-slot="{ errors }">
                        <a-input
                            v-model="form.name"
                            :class="{ error: errors[0] }"
                            type="text"
                            placeholder="请输入用户名"
                        >
                            <a-icon slot="prefix" type="user" class="icon" />
                        </a-input>
                        <span class="error-tip">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="filed">
                    <ValidationProvider name="密码" rules="required" v-slot="{ errors }">
                        <a-input
                            v-model="form.password"
                            :class="{ error: errors[0] }"
                            type="password"
                            placeholder="请输入密码"
                        >
                            <a-icon slot="prefix" type="lock" class="icon" />
                        </a-input>
                        <span class="error-tip">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="filed">
                    <a-button type="primary" html-type="submit">登陆</a-button>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: '',
                password: ''
            }
        };
    },
    methods: {
        submit() {
            this.$store.dispatch('user/login', this.form);
        }
    }
};
</script>

<style lang="scss">
.authorization {
    display: flex;
    justify-content: center;
    align-items: center;
}
form {
    width: 400px;
}
.filed {
    margin: 20px;
    button {
        width: 100%;
    }
}
.icon {
    color: rgba(0, 0, 0, 0.25);
}
.error-tip {
    font-size: 12px;
    color: #f00;
}
.error {
    border: 1px solid #f00;
}
</style>