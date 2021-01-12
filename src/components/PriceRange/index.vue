<template>
    <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="min">
            <el-input v-model="form.min" @change="handleMinChange" />
        </el-form-item>
        ~
        <el-form-item prop="max">
            <el-input v-model="form.max" @change="handleMaxChange" />
        </el-form-item>
    </el-form>
</template>
  
<script>
const MIN_NUMBER = 1;
const MAX_NUMBER = 100000;

export default {
    model: {
        prop: "msg",
        event: "func"
    },
    data() {
        return {
            form: { min: '20', max: '100000' },
            rules: {
                min: [
                    { required: true, message: '必填项，请维护', trigger: 'blur' },
                    { validator: this.validateCom, trigger: 'blur' },
                    { validator: this.validateMin, trigger: 'blur' },
                ],
                max: [
                    { required: true, message: '必填项，请维护', trigger: 'blur' },
                    { validator: this.validateCom, trigger: 'blur' },
                    { validator: this.validateMax, trigger: 'blur' },
                ],
            },
        };
    },
    mounted() {
        if (this.msg) {
            this.form.min = this.msg[0]
            this.form.max = this.msg[1]
        }
    },
    methods: {
        getFormData() {
            const ret = {};
            this.$refs.form.validate((valid) => {
                ret.valid = valid;
                ret.form = this.form;
            });
            return ret;
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        handleMinChange() {
            this.$refs.form.validateField('max', (res => {
                console.log('验证大的数字')
            }));
        },
        handleMaxChange() {
            this.$refs.form.validateField('min');
        },
        validateCom(rule, value, callback) {
            const one = Number(value);
            if (Number.isInteger(one)) {
                if (one < MIN_NUMBER) {
                    return callback(new Error('输入值必须大于0'));
                } else if (one > MAX_NUMBER) {
                    return callback(new Error('输入值必须小于100000'));
                }
                return callback();
            }
            return callback(new Error('输入值必须为正整数'));
        },
        validateMin(rule, value, callback) {
            const one = Number(value);
            const max = Number(this.form.max);
            if (!max || one < max) {
                return callback();
            }
            return callback(new Error('输入值不得大于最大阈值'));
        },
        validateMax(rule, value, callback) {
            const one = Number(value);
            const min = Number(this.form.min);
            if (!min || one > min) {
                return callback();
            }
            return callback(new Error('输入值不得小于最小阈值'));
        },
    },
};
</script>