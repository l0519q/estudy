<template>
    <a-layout id="app">
        <!-- 页面头部 -->
        <a-layout-header class="header flexrow">
            <h2>蝉壳 eStudy</h2>
            <div
                v-if="loggedIn"
                class="right flexrow"
            >
                <div
                    v-if="isTeacher"
                    class="flexrow"
                >
                    <h4>{{ info.name }}</h4>
                    <a-button
                        class="vcenter"
                        type="primary"
                        icon="file-add"
                        @click="showAssignment = true"
                    >
                        新建作业
                    </a-button>
                </div>
                <div
                    v-else
                    class="flexrow"
                >
                    <h4 class="flexcol">
                        <span>{{ info.full_name }}</span>
                        <span>学号：{{ info.name }}</span>
                    </h4>
                    <h5 class="flexcol">
                        <span
                            v-for="(org, index) in student.orgs"
                            :key="`org_${index}`"
                        >
                            {{ org }}
                        </span>
                    </h5>
                </div>
                <a
                    href="http://vipgit.chanke.xyz/"
                    target="_blank"
                    class="home"
                >
                    <a-button icon="home">代码仓库</a-button>
                </a>
                <a-button
                    class="vcenter"
                    icon="logout"
                    @click="$store.dispatch('user/logout')"
                >
                    退出
                </a-button>
            </div>
        </a-layout-header>

        <!-- 页面内容区域 -->
        <a-layout-content>
            <Authorization v-if="!loggedIn" />
            <div v-else>
                <Teacher
                    v-if="isTeacher"
                    :teacher="teacher"
                />
                <Student
                    v-else
                    :student="student"
                />
            </div>

            <!-- 新建作业模态框 -->
            <a-modal
                v-model="showAssignment"
                :footer="null"
            >
                <a-form>
                    <a-form-item
                        label="课程"
                        :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 18 }"
                    >
                        <a-select v-model="createAssignmentForm.org_id">
                            <a-select-option
                                v-for="(org, index) in teacher.orgs"
                                :key="`${org}_${index}`"
                                :value="org.id"
                            >
                                {{ org.full_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        label="作业名称"
                        :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 18 }"
                    >
                        <a-input v-model="createAssignmentForm.name"></a-input>
                    </a-form-item>
                    <a-form-item
                        label="开始/结束时间"
                        :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 18 }"
                    >
                        <a-locale-provider :locale="zh_CN">
                            <a-range-picker v-model="createAssignmentForm.time_range"></a-range-picker>
                        </a-locale-provider>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 18, offset: 6 }">
                        <a-button
                            type="primary"
                            @click="saveAssignment"
                        >
                            保存
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-layout-content>
    </a-layout>
</template>

<script>
import Authorization from './components/Authorization';
import Teacher from './components/Teacher';
import Student from './components/Student';
import { mapState } from 'vuex';
import api from './utils/api';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default {
    components: {
        Authorization,
        Teacher,
        Student
    },
    data() {
        return {
            teacher: {
                orgs: [],
                assignments: []
            },
            student: {
                orgs: [],
                assignments: []
            },
            showAssignment: false,
            createAssignmentForm: {
                org_id: '',
                name: '',
                time_range: [moment(), moment()]
            },
            zh_CN
        };
    },
    computed: {
        ...mapState('user', ['info', 'loggedIn']),
        isTeacher() {
            return this.info.is_admin > 0;
        }
    },
    watch: {
        loggedIn(val) {
            if (val) {
                this.loadDetails();
            }
        }
    },
    created() {
        if (this.loggedIn) {
            this.loadDetails();
        }
    },
    methods: {
        loadDetails() {
            if (this.isTeacher) {
                api.get('/teacher/detail').then(data => {
                    this.teacher.orgs = data.orgs;
                    this.teacher.assignments = data.assignments;
                });
            } else {
                api.get('/student/detail').then(data => {
                    this.student.orgs = data.orgs;
                    this.student.assignments = data.assignments;
                });
            }
        },
        saveAssignment() {
            const form = {
                org_id: this.createAssignmentForm.org_id,
                name: this.createAssignmentForm.name,
                start_time: this.createAssignmentForm.time_range[0].format(
                    'YYYY-MM-DD'
                ),
                end_time: this.createAssignmentForm.time_range[1].format(
                    'YYYY-MM-DD'
                )
            };
            api.post('/teacher/createAssignment', form)
                .then(data => {
                    this.teacher.assignments.unshift(data);
                })
                .finally(() => {
                    this.showAssignment = false;
                });
        }
    }
};
</script>

<style lang="scss">
#app {
    min-height: 100vh;
    color: #ccc;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.header {
    font-size: 1.1em;
    color: #fff;
    h2,
    h4,
    h5 {
        margin-bottom: 0;
        color: #fff;
    }
}
.flexrow {
    display: flex;
}
.right {
    margin-left: auto;
}
.right > .flexrow > *,
.right > a {
    margin-right: 25px;
}
.flexcol {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    span {
        flex: 1;
        max-height: 20px;
        line-height: 20px;
    }
}
.vcenter {
    align-self: center;
}
@media screen and (max-width: 576px) {
    .header {
        padding: 0 15px;
        h4,
        h5,
        .home {
            display: none;
        }
        h2 {
            font-size: 18px;
        }
    }
    .right > a {
        margin-right: 10px;
    }
    .ant-btn {
        height: 24px;
        padding: 0 7px;
    }
    .ant-form {
        width: 90%;
    }
}
</style>
