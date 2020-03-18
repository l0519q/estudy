<template>
    <div>
        <a-table
            :columns="columns"
            :dataSource="student.assignments"
            :rowKey="assignment => assignment.assignment_id"
            :pagination="false"
            :scroll="{ x: true }"
        >
            <template #operation="record">
                <a-upload
                    name="file"
                    :action="uploadHost"
                    :headers="{ Token: info.token }"
                    :data="{ id: record.assignment_id }"
                    :showUploadList="false"
                    @change="changeUpload"
                >
                    <a-button icon="upload">上传</a-button>
                </a-upload>
                <a
                    v-if="record.work"
                    :href="`${downloadHost}?id=${record.work.id}&type=student`"
                >
                    <a-button icon="download">下载</a-button>
                </a>
            </template>
            <template #info="record">
                <div v-if="record.work">
                    <div v-if="record.work.status == 0">
                        {{ record.work.teacher_download_time.slice(0, 10) == '0000-00-00'
                        ? `${record.work.commit_time} 提交`
                        : `${record.work.teacher_download_time} 老师已下载` }}
                    </div>
                    <div v-else-if="record.work.status == 1">
                        <p>{{ `${record.work.review_time} 老师提交修改意见` }}</p>
                        <a-button @click="visible = record.work">查看详情</a-button>
                    </div>
                    <div v-else>
                        <p>{{ `${record.work.review_time} 老师批改完成` }}</p>
                        <a-button @click="visible = record.work">查看详情</a-button>
                    </div>
                </div>
            </template>
        </a-table>

        <a-modal
            title="批改意见"
            :visible="Boolean(visible)"
            @cancel="visible = false"
        >
            <p v-if="visible && visible.teacher_review">{{ visible.teacher_review }}</p>
            <p v-if="visible && visible.teacher_upload_name">
                <a :href="`${downloadHost}?id=${visible.id}&type=teacher`">
                    <a-button>附件</a-button>
                </a>
            </p>
            <template #footer>
                <a-button
                    type="primary"
                    @click="visible = false"
                >
                    明白了
                </a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';

const HOST = 'https://sandbox-api.estudy.chanke.xyz';
const work_status = {
    '0': '待批改',
    '1': '需完善',
    '2': '已完成'
};
const columns = [
    {
        title: '课程',
        dataIndex: 'org_name'
    },
    {
        title: '作业名称',
        dataIndex: 'name'
    },
    {
        title: '开始-截止时间',
        customRender(text, record) {
            return `${record.start_time} ~ ${record.end_time}`;
        }
    },
    {
        title: '操作',
        scopedSlots: {
            customRender: 'operation'
        }
    },
    {
        title: '状态',
        customRender(text, record) {
            return record.work ? work_status[record.work.status] : '未提交';
        }
    },
    {
        title: '信息',
        scopedSlots: {
            customRender: 'info'
        }
    }
];

export default {
    props: ['student'],
    data() {
        return {
            columns,
            visible: false,
            uploadHost: HOST + '/student/upload',
            downloadHost: HOST + '/student/download'
        };
    },
    computed: {
        ...mapState('user', ['info'])
    },
    methods: {
        changeUpload(info) {
            if (info.file.status === 'done' && info.file.response.data) {
                this.$message.info('上传成功');
            } else if (info.file.status === 'error') {
                this.$notification.error({
                    message: '上传失败',
                    description: info.file.response.errorMessage
                });
            }
        }
    }
};
</script>

<style>
</style>