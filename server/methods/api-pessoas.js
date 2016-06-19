/**
 * Created by diogomartins on 4/6/16.
 */
Meteor.methods({
    'getPessoaDados': function (cpf) {
        let dados = apiClient.get('V_PESSOAS_FOTO', {
            'CPF': cpf,
            'LMIN': 0,
            'LMAX': 1,
            'ORDERBY': 'CPF'
        }, ['NOME_PESSOA', 'FOTO']);

        return dados.content[0];
    }
});



Accounts.onLogin(function(info){
    if ((info.methodName === "login") && (info.type !== "resume")){
        const user = info.user;

        const result = apiClient.get('V_PESSOAS_FOTO', {
            'CPF': user.username,
            'LMIN': 0,
            'LMAX': 1,
            'ORDERBY': 'CPF'
        }, ['NOME_PESSOA', 'FOTO']);
        const dados = result.content[0];

        if (typeof dados.FOTO !== 'string'){
            Meteor.call('getRandomMockUser', (error, result) => {
                if (typeof error === 'undefined') {
                    Meteor.users.update(user._id, {
                        $set: {
                            'profile.fullname': dados.NOME_PESSOA,
                            'profile.avatar': result.profile.avatar
                        }
                    });
                } else{
                    // todo: tratar erro
                    console.log("Erro atualizando foto: ", error);
                }
            });

        } else{
            dados.FOTO = "data:image/jpeg;base64," + dados.FOTO;
            Meteor.users.update(user._id, {$set: {'profile.fullname': dados.NOME_PESSOA, 'profile.avatar': dados.FOTO}});
        }


    }
});